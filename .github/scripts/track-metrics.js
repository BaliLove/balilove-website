/**
 * DORA Metrics Tracking Script
 * Tracks the four key DORA metrics: Deployment Frequency, Lead Time, Change Failure Rate, MTTR
 */

const fs = require('fs');
const path = require('path');

// Metrics data storage (in production, this would be a database)
const METRICS_FILE = path.join(process.cwd(), '.github', 'data', 'dora-metrics.json');

/**
 * Ensure metrics data directory exists
 */
function ensureMetricsDirectory() {
  const dataDir = path.dirname(METRICS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Load existing metrics data
 */
function loadMetricsData() {
  ensureMetricsDirectory();
  
  if (fs.existsSync(METRICS_FILE)) {
    try {
      const data = fs.readFileSync(METRICS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading metrics data:', error);
    }
  }
  
  return {
    deployments: [],
    pullRequests: [],
    incidents: [],
    leadTimes: [],
    lastCalculated: null
  };
}

/**
 * Save metrics data
 */
function saveMetricsData(data) {
  ensureMetricsDirectory();
  
  try {
    fs.writeFileSync(METRICS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving metrics data:', error);
  }
}

/**
 * Track PR creation/merge events for lead time calculation
 */
async function trackPREvent(github, context, eventType) {
  const data = loadMetricsData();
  
  if (eventType === 'pr_opened') {
    data.pullRequests.push({
      number: context.payload.pull_request.number,
      created_at: context.payload.pull_request.created_at,
      merged_at: null,
      first_commit_sha: context.payload.pull_request.head.sha,
      status: 'open'
    });
  }
  
  saveMetricsData(data);
}

/**
 * Track PR merge for lead time calculation
 */
async function trackPRMerge(github, context, prData) {
  const data = loadMetricsData();
  
  // Find the PR in our data
  const prIndex = data.pullRequests.findIndex(pr => pr.number === prData.pr_number);
  if (prIndex >= 0) {
    data.pullRequests[prIndex].merged_at = prData.merged_at;
    data.pullRequests[prIndex].status = 'merged';
  } else {
    // PR not tracked, add it retroactively
    data.pullRequests.push({
      number: prData.pr_number,
      created_at: prData.created_at,
      merged_at: prData.merged_at,
      first_commit_sha: prData.first_commit_date,
      status: 'merged'
    });
  }
  
  // Calculate lead time for this PR
  const createdDate = new Date(prData.created_at);
  const mergedDate = new Date(prData.merged_at);
  const leadTimeHours = (mergedDate - createdDate) / (1000 * 60 * 60);
  
  data.leadTimes.push({
    pr_number: prData.pr_number,
    lead_time_hours: leadTimeHours,
    date: prData.merged_at
  });
  
  saveMetricsData(data);
}

/**
 * Track deployment events
 */
async function trackDeployment(github, context, deploymentData) {
  const data = loadMetricsData();
  
  data.deployments.push({
    id: deploymentData.deployment_id,
    environment: deploymentData.environment,
    status: deploymentData.status,
    created_at: deploymentData.created_at,
    updated_at: deploymentData.updated_at,
    duration: new Date(deploymentData.updated_at) - new Date(deploymentData.created_at)
  });
  
  saveMetricsData(data);
}

/**
 * Track incidents for change failure rate and MTTR
 */
async function trackIncident(github, context, incidentData) {
  const data = loadMetricsData();
  
  data.incidents.push({
    id: incidentData.id,
    created_at: incidentData.created_at,
    resolved_at: incidentData.resolved_at,
    severity: incidentData.severity,
    related_deployment: incidentData.related_deployment,
    mttr_hours: incidentData.resolved_at 
      ? (new Date(incidentData.resolved_at) - new Date(incidentData.created_at)) / (1000 * 60 * 60)
      : null
  });
  
  saveMetricsData(data);
}

/**
 * Calculate DORA metrics for a given period
 */
async function calculateDORAMetrics(github, context, periodDays = 7) {
  const data = loadMetricsData();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - periodDays);
  
  // 1. Deployment Frequency
  const deploymentsInPeriod = data.deployments.filter(dep => 
    new Date(dep.created_at) >= periodStart && dep.status === 'success'
  );
  const deploymentFrequency = deploymentsInPeriod.length / periodDays;
  
  // 2. Lead Time for Changes
  const leadTimesInPeriod = data.leadTimes.filter(lt => 
    new Date(lt.date) >= periodStart
  );
  const averageLeadTime = leadTimesInPeriod.length > 0 
    ? leadTimesInPeriod.reduce((sum, lt) => sum + lt.lead_time_hours, 0) / leadTimesInPeriod.length
    : 0;
  
  // 3. Change Failure Rate
  const failedDeployments = data.deployments.filter(dep => 
    new Date(dep.created_at) >= periodStart && dep.status === 'failure'
  );
  const totalDeployments = data.deployments.filter(dep => 
    new Date(dep.created_at) >= periodStart
  );
  const changeFailureRate = totalDeployments.length > 0 
    ? (failedDeployments.length / totalDeployments.length) * 100
    : 0;
  
  // 4. Mean Time to Recovery (MTTR)
  const incidentsInPeriod = data.incidents.filter(inc => 
    new Date(inc.created_at) >= periodStart && inc.resolved_at
  );
  const averageMTTR = incidentsInPeriod.length > 0
    ? incidentsInPeriod.reduce((sum, inc) => sum + inc.mttr_hours, 0) / incidentsInPeriod.length
    : 0;
  
  // Performance classification based on DORA research
  const performance = classifyPerformance({
    deploymentFrequency,
    averageLeadTime,
    changeFailureRate,
    averageMTTR
  });
  
  return {
    period: `${periodDays} days`,
    periodStart: periodStart.toISOString(),
    periodEnd: new Date().toISOString(),
    metrics: {
      deploymentFrequency: {
        value: deploymentFrequency,
        unit: 'deployments per day',
        count: deploymentsInPeriod.length
      },
      leadTime: {
        value: Math.round(averageLeadTime * 10) / 10,
        unit: 'hours',
        count: leadTimesInPeriod.length
      },
      changeFailureRate: {
        value: Math.round(changeFailureRate * 10) / 10,
        unit: 'percentage',
        failed: failedDeployments.length,
        total: totalDeployments.length
      },
      mttr: {
        value: Math.round(averageMTTR * 10) / 10,
        unit: 'hours',
        count: incidentsInPeriod.length
      }
    },
    performance,
    recommendations: generateRecommendations(performance)
  };
}

/**
 * Classify performance based on DORA benchmarks
 */
function classifyPerformance(metrics) {
  let score = 0;
  const classifications = {};
  
  // Deployment Frequency (per day)
  if (metrics.deploymentFrequency >= 1) {
    classifications.deploymentFrequency = 'Elite';
    score += 4;
  } else if (metrics.deploymentFrequency >= 0.14) { // Weekly
    classifications.deploymentFrequency = 'High';
    score += 3;
  } else if (metrics.deploymentFrequency >= 0.03) { // Monthly
    classifications.deploymentFrequency = 'Medium';
    score += 2;
  } else {
    classifications.deploymentFrequency = 'Low';
    score += 1;
  }
  
  // Lead Time (hours)
  if (metrics.averageLeadTime <= 24) {
    classifications.leadTime = 'Elite';
    score += 4;
  } else if (metrics.averageLeadTime <= 168) { // 1 week
    classifications.leadTime = 'High';
    score += 3;
  } else if (metrics.averageLeadTime <= 720) { // 1 month
    classifications.leadTime = 'Medium';
    score += 2;
  } else {
    classifications.leadTime = 'Low';
    score += 1;
  }
  
  // Change Failure Rate (percentage)
  if (metrics.changeFailureRate <= 5) {
    classifications.changeFailureRate = 'Elite';
    score += 4;
  } else if (metrics.changeFailureRate <= 10) {
    classifications.changeFailureRate = 'High';
    score += 3;
  } else if (metrics.changeFailureRate <= 20) {
    classifications.changeFailureRate = 'Medium';
    score += 2;
  } else {
    classifications.changeFailureRate = 'Low';
    score += 1;
  }
  
  // MTTR (hours)
  if (metrics.averageMTTR <= 1) {
    classifications.mttr = 'Elite';
    score += 4;
  } else if (metrics.averageMTTR <= 24) {
    classifications.mttr = 'High';
    score += 3;
  } else if (metrics.averageMTTR <= 168) { // 1 week
    classifications.mttr = 'Medium';
    score += 2;
  } else {
    classifications.mttr = 'Low';
    score += 1;
  }
  
  // Overall performance
  const averageScore = score / 4;
  let overall = 'Low';
  if (averageScore >= 3.5) overall = 'Elite';
  else if (averageScore >= 2.5) overall = 'High';
  else if (averageScore >= 1.5) overall = 'Medium';
  
  return {
    overall,
    score: Math.round(averageScore * 10) / 10,
    individual: classifications
  };
}

/**
 * Generate recommendations based on performance
 */
function generateRecommendations(performance) {
  const recommendations = [];
  
  if (performance.individual.deploymentFrequency === 'Low') {
    recommendations.push('🚀 Increase deployment frequency by implementing continuous deployment');
    recommendations.push('📦 Consider breaking down releases into smaller, more frequent deployments');
  }
  
  if (performance.individual.leadTime === 'Low') {
    recommendations.push('⚡ Reduce lead time by optimizing development workflow');
    recommendations.push('🔄 Implement better CI/CD practices and automated testing');
  }
  
  if (performance.individual.changeFailureRate === 'Low') {
    recommendations.push('🛡️ Improve change failure rate with better testing and code review');
    recommendations.push('🔍 Implement feature flags and gradual rollouts');
  }
  
  if (performance.individual.mttr === 'Low') {
    recommendations.push('🔧 Reduce MTTR with better monitoring and alerting');
    recommendations.push('📋 Create incident response playbooks and procedures');
  }
  
  if (performance.overall === 'Elite') {
    recommendations.push('🏆 Excellent performance! Share your practices with other teams');
  }
  
  return recommendations;
}

/**
 * Post metrics as a GitHub comment
 */
async function postMetricsComment(github, context, metrics) {
  // Find or create metrics tracking issue
  const { data: issues } = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open',
    labels: 'metrics-tracking'
  });
  
  let trackingIssue = issues[0];
  if (!trackingIssue) {
    const { data: newIssue } = await github.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: '📊 DORA Metrics Tracking',
      body: 'This issue tracks DORA metrics and performance indicators.',
      labels: ['metrics-tracking', 'dora-metrics']
    });
    trackingIssue = newIssue;
  }
  
  const metricsComment = `## 📈 DORA Metrics Report (${metrics.period})
  
**Overall Performance: ${metrics.performance.overall}** (Score: ${metrics.performance.score}/4.0)

### 📊 Metrics

| Metric | Value | Performance | Target |
|--------|-------|-------------|---------|
| 🚀 Deployment Frequency | ${metrics.metrics.deploymentFrequency.value} per day (${metrics.metrics.deploymentFrequency.count} total) | ${metrics.performance.individual.deploymentFrequency} | Multiple per day |
| ⚡ Lead Time for Changes | ${metrics.metrics.leadTime.value} hours (${metrics.metrics.leadTime.count} PRs) | ${metrics.performance.individual.leadTime} | < 24 hours |
| 🛡️ Change Failure Rate | ${metrics.metrics.changeFailureRate.value}% (${metrics.metrics.changeFailureRate.failed}/${metrics.metrics.changeFailureRate.total}) | ${metrics.performance.individual.changeFailureRate} | < 5% |
| 🔧 Mean Time to Recovery | ${metrics.metrics.mttr.value} hours (${metrics.metrics.mttr.count} incidents) | ${metrics.performance.individual.mttr} | < 1 hour |

### 💡 Recommendations

${metrics.recommendations.map(rec => `- ${rec}`).join('\n')}

### 📊 Performance Classification
- **Elite**: Top 10% of performers
- **High**: Better than most organizations  
- **Medium**: Typical organizational performance
- **Low**: Below average performance

*Report generated on: ${new Date().toISOString()}*
*Period: ${metrics.periodStart} to ${metrics.periodEnd}*`;

  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: trackingIssue.number,
    body: metricsComment
  });
  
  console.log(`DORA metrics posted to issue #${trackingIssue.number}`);
}

module.exports = {
  trackPREvent,
  trackPRMerge,
  trackDeployment,
  trackIncident,
  calculateDORAMetrics,
  postMetricsComment,
  loadMetricsData,
  saveMetricsData
};