/**
 * Team Velocity Analysis Script
 * Tracks team velocity in hours/day and analyzes productivity trends
 */

const fs = require('fs');
const path = require('path');
const { extractHoursFromLabels } = require('./estimate-completion');

// Configuration
const VELOCITY_FILE = path.join(process.cwd(), '.github', 'data', 'velocity-data.json');
const WORKING_HOURS_PER_DAY = 6;

/**
 * Ensure velocity data directory exists
 */
function ensureVelocityDirectory() {
  const dataDir = path.dirname(VELOCITY_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Load existing velocity data
 */
function loadVelocityData() {
  ensureVelocityDirectory();
  
  if (fs.existsSync(VELOCITY_FILE)) {
    try {
      const data = fs.readFileSync(VELOCITY_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading velocity data:', error);
    }
  }
  
  return {
    issueTransitions: [],
    dailyVelocity: [],
    weeklyVelocity: [],
    lastCalculated: null
  };
}

/**
 * Save velocity data
 */
function saveVelocityData(data) {
  ensureVelocityDirectory();
  
  try {
    fs.writeFileSync(VELOCITY_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving velocity data:', error);
  }
}

/**
 * Track issue state transitions (Zenhub pipeline changes)
 */
async function trackIssueTransition(github, context, issueData) {
  const data = loadVelocityData();
  
  // Map GitHub labels to Zenhub-like pipeline stages
  const pipelineMapping = {
    'icebox': 'Icebox',
    'backlog': 'Backlog', 
    'ready': 'Ready',
    'in-progress': 'In Progress',
    'in progress': 'In Progress',
    'review': 'Review',
    'qa': 'QA',
    'done': 'Done',
    'closed': 'Done'
  };
  
  // Determine pipeline stage from labels
  let currentStage = 'Backlog'; // Default
  for (const label of issueData.labels) {
    const labelName = label.name.toLowerCase();
    if (pipelineMapping[labelName]) {
      currentStage = pipelineMapping[labelName];
      break;
    }
  }
  
  // If issue is closed, it's Done
  if (issueData.state === 'closed') {
    currentStage = 'Done';
  }
  
  const transition = {
    issue_number: issueData.number,
    title: issueData.title,
    from_stage: null, // We'll try to determine this from history
    to_stage: currentStage,
    timestamp: new Date().toISOString(),
    action: issueData.action,
    estimated_hours: extractHoursFromLabels(issueData.labels),
    created_at: issueData.created_at,
    closed_at: issueData.closed_at
  };
  
  // Find the most recent transition for this issue to determine 'from_stage'
  const recentTransitions = data.issueTransitions
    .filter(t => t.issue_number === issueData.number)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  if (recentTransitions.length > 0) {
    transition.from_stage = recentTransitions[0].to_stage;
  }
  
  data.issueTransitions.push(transition);
  saveVelocityData(data);
  
  console.log(`Tracked transition for issue #${issueData.number}: ${transition.from_stage || 'Unknown'} → ${transition.to_stage}`);
}

/**
 * Calculate daily velocity based on completed work
 */
async function calculateDailyVelocity(github, context, days = 30) {
  const data = loadVelocityData();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  // Get completed issues in the period
  const completedTransitions = data.issueTransitions.filter(transition => 
    transition.to_stage === 'Done' &&
    new Date(transition.timestamp) >= startDate &&
    new Date(transition.timestamp) <= endDate &&
    transition.estimated_hours
  );
  
  // Group by date
  const dailyCompletions = {};
  
  for (const transition of completedTransitions) {
    const date = new Date(transition.timestamp).toISOString().split('T')[0];
    if (!dailyCompletions[date]) {
      dailyCompletions[date] = {
        date,
        hours: 0,
        issues: 0,
        items: []
      };
    }
    
    dailyCompletions[date].hours += transition.estimated_hours;
    dailyCompletions[date].issues += 1;
    dailyCompletions[date].items.push({
      number: transition.issue_number,
      title: transition.title,
      hours: transition.estimated_hours
    });
  }
  
  // Convert to array and calculate statistics
  const dailyVelocities = Object.values(dailyCompletions);
  const totalHours = dailyVelocities.reduce((sum, day) => sum + day.hours, 0);
  const totalIssues = dailyVelocities.reduce((sum, day) => sum + day.issues, 0);
  const workingDays = Math.max(1, dailyVelocities.length);
  
  const avgHoursPerDay = totalHours / workingDays;
  const avgIssuesPerDay = totalIssues / workingDays;
  
  return {
    period: `${days} days`,
    workingDays,
    totalHours,
    totalIssues,
    avgHoursPerDay: Math.round(avgHoursPerDay * 10) / 10,
    avgIssuesPerDay: Math.round(avgIssuesPerDay * 10) / 10,
    dailyBreakdown: dailyVelocities.sort((a, b) => new Date(b.date) - new Date(a.date))
  };
}

/**
 * Analyze velocity trends over time
 */
async function analyzeVelocityTrends(github, context) {
  const currentWeek = await calculateDailyVelocity(github, context, 7);
  const currentMonth = await calculateDailyVelocity(github, context, 30);
  const previousMonth = await calculateDailyVelocity(github, context, 60); // 30-60 days ago
  
  // Calculate trend
  const weeklyTrend = currentWeek.avgHoursPerDay - currentMonth.avgHoursPerDay;
  const monthlyTrend = currentMonth.avgHoursPerDay - previousMonth.avgHoursPerDay;
  
  // Analyze cycle time (average time from start to completion)
  const data = loadVelocityData();
  const completedIssues = data.issueTransitions
    .filter(t => t.to_stage === 'Done' && t.estimated_hours)
    .slice(-20); // Last 20 completed issues
  
  let totalCycleTime = 0;
  let cycleTimeCount = 0;
  
  for (const completion of completedIssues) {
    if (completion.created_at && completion.timestamp) {
      const cycleTime = (new Date(completion.timestamp) - new Date(completion.created_at)) / (1000 * 60 * 60 * 24);
      totalCycleTime += cycleTime;
      cycleTimeCount++;
    }
  }
  
  const avgCycleTimeDays = cycleTimeCount > 0 ? totalCycleTime / cycleTimeCount : 0;
  
  return {
    currentWeek,
    currentMonth,
    trends: {
      weekly: {
        change: Math.round(weeklyTrend * 10) / 10,
        direction: weeklyTrend > 0 ? 'up' : weeklyTrend < 0 ? 'down' : 'stable'
      },
      monthly: {
        change: Math.round(monthlyTrend * 10) / 10,
        direction: monthlyTrend > 0 ? 'up' : monthlyTrend < 0 ? 'down' : 'stable'
      }
    },
    cycleTime: {
      avgDays: Math.round(avgCycleTimeDays * 10) / 10,
      sampleSize: cycleTimeCount
    }
  };
}

/**
 * Get pipeline distribution (where work is stuck)
 */
async function getPipelineDistribution(github, context) {
  // Get all open issues
  const { data: openIssues } = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open',
    per_page: 100
  });
  
  const pipelineDistribution = {
    'Icebox': { count: 0, hours: 0, issues: [] },
    'Backlog': { count: 0, hours: 0, issues: [] },
    'Ready': { count: 0, hours: 0, issues: [] },
    'In Progress': { count: 0, hours: 0, issues: [] },
    'Review': { count: 0, hours: 0, issues: [] },
    'QA': { count: 0, hours: 0, issues: [] }
  };
  
  for (const issue of openIssues) {
    let stage = 'Backlog'; // Default
    
    // Determine stage from labels
    for (const label of issue.labels) {
      const labelName = label.name.toLowerCase();
      if (labelName.includes('icebox')) stage = 'Icebox';
      else if (labelName.includes('ready')) stage = 'Ready';
      else if (labelName.includes('in-progress') || labelName.includes('in progress')) stage = 'In Progress';
      else if (labelName.includes('review')) stage = 'Review';
      else if (labelName.includes('qa')) stage = 'QA';
    }
    
    const estimatedHours = extractHoursFromLabels(issue.labels) || 0;
    
    if (pipelineDistribution[stage]) {
      pipelineDistribution[stage].count++;
      pipelineDistribution[stage].hours += estimatedHours;
      pipelineDistribution[stage].issues.push({
        number: issue.number,
        title: issue.title,
        hours: estimatedHours
      });
    }
  }
  
  return pipelineDistribution;
}

/**
 * Generate velocity insights and recommendations
 */
function generateVelocityInsights(velocityData) {
  const insights = [];
  const recommendations = [];
  
  // Velocity analysis
  if (velocityData.currentWeek.avgHoursPerDay < 3) {
    insights.push('⚠️ Low weekly velocity detected');
    recommendations.push('Consider reducing work in progress or removing blockers');
  } else if (velocityData.currentWeek.avgHoursPerDay > 8) {
    insights.push('🔥 Very high velocity - great work!');
    recommendations.push('Monitor for burnout and ensure sustainable pace');
  } else {
    insights.push('✅ Healthy velocity within expected range');
  }
  
  // Trend analysis
  if (velocityData.trends.weekly.direction === 'up') {
    insights.push('📈 Velocity trending upward this week');
  } else if (velocityData.trends.weekly.direction === 'down') {
    insights.push('📉 Velocity trending downward this week');
    recommendations.push('Investigate potential blockers or process issues');
  }
  
  // Cycle time analysis
  if (velocityData.cycleTime.avgDays > 7) {
    insights.push('🐌 Long cycle time detected (>7 days)');
    recommendations.push('Consider breaking down larger tasks or improving workflow');
  } else if (velocityData.cycleTime.avgDays < 3) {
    insights.push('⚡ Fast cycle time - excellent flow!');
  }
  
  return { insights, recommendations };
}

/**
 * Main velocity analysis function
 */
async function analyzeVelocity(github, context) {
  const velocityTrends = await analyzeVelocityTrends(github, context);
  const pipelineDistribution = await getPipelineDistribution(github, context);
  const insights = generateVelocityInsights(velocityTrends);
  
  return {
    ...velocityTrends,
    pipelineDistribution,
    insights: insights.insights,
    recommendations: insights.recommendations,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Post velocity analysis as GitHub comment
 */
async function postVelocityComment(github, context, velocityData) {
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
      title: '📊 Team Velocity & Metrics Tracking',
      body: 'This issue tracks team velocity, productivity metrics, and workflow analysis.',
      labels: ['metrics-tracking', 'velocity']
    });
    trackingIssue = newIssue;
  }
  
  // Format pipeline distribution
  const pipelineTable = Object.entries(velocityData.pipelineDistribution)
    .map(([stage, data]) => `| ${stage} | ${data.count} | ${data.hours}h |`)
    .join('\n');
  
  const velocityComment = `## 🚀 Team Velocity Report
  
### 📊 Current Performance
- **This Week**: ${velocityData.currentWeek.avgHoursPerDay} hours/day (${velocityData.currentWeek.totalHours}h total)
- **This Month**: ${velocityData.currentMonth.avgHoursPerDay} hours/day (${velocityData.currentMonth.totalHours}h total)
- **Cycle Time**: ${velocityData.cycleTime.avgDays} days average

### 📈 Trends
- **Weekly Trend**: ${velocityData.trends.weekly.direction === 'up' ? '📈' : velocityData.trends.weekly.direction === 'down' ? '📉' : '➡️'} ${Math.abs(velocityData.trends.weekly.change)} hours/day
- **Monthly Trend**: ${velocityData.trends.monthly.direction === 'up' ? '📈' : velocityData.trends.monthly.direction === 'down' ? '📉' : '➡️'} ${Math.abs(velocityData.trends.monthly.change)} hours/day

### 🏗️ Pipeline Distribution
| Stage | Issues | Hours |
|-------|--------|-------|
${pipelineTable}

### 💡 Insights
${velocityData.insights.map(insight => `- ${insight}`).join('\n')}

### 🎯 Recommendations  
${velocityData.recommendations.map(rec => `- ${rec}`).join('\n')}

*Report generated on: ${velocityData.generatedAt}*`;

  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: trackingIssue.number,
    body: velocityComment
  });
  
  console.log(`Velocity analysis posted to issue #${trackingIssue.number}`);
}

module.exports = {
  trackIssueTransition,
  calculateDailyVelocity,
  analyzeVelocityTrends,
  getPipelineDistribution,
  analyzeVelocity,
  postVelocityComment,
  loadVelocityData,
  saveVelocityData
};