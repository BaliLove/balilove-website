/**
 * Daily Standup Analysis Script
 * Analyzes yesterday's progress and updates estimates for 7 AM +8 timezone
 */

/**
 * Main function to analyze yesterday's progress
 */
async function analyzeYesterdayProgress(github, context, openaiKey) {
  console.log('🔍 Starting daily progress analysis...');
  
  try {
    // Get yesterday's commits
    const yesterdayCommits = await getYesterdayCommits(github, context);
    console.log(`Found ${yesterdayCommits.length} commits from yesterday`);
    
    // Group commits by issue
    const commitsByIssue = groupCommitsByIssue(yesterdayCommits);
    console.log(`Commits linked to ${Object.keys(commitsByIssue).length} issues`);
    
    // Analyze progress for each issue
    const progressAnalysis = {};
    for (const [issueNumber, commits] of Object.entries(commitsByIssue)) {
      try {
        const analysis = await analyzeIssueProgress(github, context, issueNumber, commits, openaiKey);
        progressAnalysis[issueNumber] = analysis;
      } catch (error) {
        console.error(`Error analyzing issue #${issueNumber}:`, error);
        progressAnalysis[issueNumber] = { error: error.message };
      }
    }
    
    return {
      totalCommits: yesterdayCommits.length,
      issuesWorkedOn: Object.keys(commitsByIssue).length,
      progressAnalysis,
      analysisDate: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error in daily progress analysis:', error);
    throw error;
  }
}

/**
 * Get commits from yesterday
 */
async function getYesterdayCommits(github, context) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  try {
    const { data: commits } = await github.rest.repos.listCommits({
      owner: context.repo.owner,
      repo: context.repo.repo,
      since: yesterday.toISOString(),
      until: today.toISOString(),
      per_page: 100
    });
    
    return commits.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
      stats: commit.stats || null
    }));
    
  } catch (error) {
    console.error('Error fetching yesterday\'s commits:', error);
    return [];
  }
}

/**
 * Group commits by issue number (extract from commit messages)
 */
function groupCommitsByIssue(commits) {
  const commitsByIssue = {};
  
  for (const commit of commits) {
    const issueNumbers = extractIssueNumbers(commit.message);
    
    for (const issueNumber of issueNumbers) {
      if (!commitsByIssue[issueNumber]) {
        commitsByIssue[issueNumber] = [];
      }
      commitsByIssue[issueNumber].push(commit);
    }
  }
  
  return commitsByIssue;
}

/**
 * Extract issue numbers from commit message
 */
function extractIssueNumbers(message) {
  const patterns = [
    /#(\d+)/g,           // #123
    /fixes #(\d+)/gi,    // fixes #123
    /closes #(\d+)/gi,   // closes #123
    /resolves #(\d+)/gi  // resolves #123
  ];
  
  const issueNumbers = new Set();
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(message)) !== null) {
      issueNumbers.add(match[1]);
    }
  }
  
  return Array.from(issueNumbers);
}

/**
 * Analyze progress on a specific issue based on commits
 */
async function analyzeIssueProgress(github, context, issueNumber, commits, openaiKey) {
  try {
    // Get issue details
    const { data: issue } = await github.rest.issues.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: parseInt(issueNumber)
    });
    
    // Get current estimate from labels
    const currentEstimate = extractCurrentEstimate(issue.labels);
    
    if (!currentEstimate) {
      console.log(`Issue #${issueNumber} has no current estimate, skipping analysis`);
      return { skipped: true, reason: 'No current estimate' };
    }
    
    // Analyze progress with AI
    const progressAnalysis = await analyzeProgressWithAI(issue, commits, currentEstimate, openaiKey);
    
    // Update estimates if needed
    if (progressAnalysis.shouldUpdateEstimate) {
      await updateIssueEstimate(github, context, issueNumber, progressAnalysis.newEstimate, progressAnalysis.reasoning);
    }
    
    return progressAnalysis;
    
  } catch (error) {
    console.error(`Error analyzing progress for issue #${issueNumber}:`, error);
    return { error: error.message };
  }
}

/**
 * Extract current time estimate from issue labels
 */
function extractCurrentEstimate(labels) {
  for (const label of labels) {
    const match = label.name.match(/⏱️\s*(\d+(?:\.\d+)?)h?/);
    if (match) {
      return {
        hours: parseFloat(match[1]),
        label: label.name
      };
    }
  }
  return null;
}

/**
 * Use AI to analyze progress based on commits
 */
async function analyzeProgressWithAI(issue, commits, currentEstimate, openaiKey) {
  if (!openaiKey) {
    return {
      shouldUpdateEstimate: false,
      reasoning: 'No OpenAI API key available for progress analysis'
    };
  }
  
  const prompt = createProgressAnalysisPrompt(issue, commits, currentEstimate);
  
  try {
    const response = await callOpenAI(prompt, openaiKey);
    return parseProgressAnalysisResponse(response, currentEstimate);
  } catch (error) {
    console.error('AI progress analysis failed:', error);
    return {
      shouldUpdateEstimate: false,
      reasoning: `AI analysis failed: ${error.message}`
    };
  }
}

/**
 * Create AI prompt for progress analysis
 */
function createProgressAnalysisPrompt(issue, commits, currentEstimate) {
  const commitSummary = commits.map(c => 
    `- ${c.message.split('\n')[0]} (${c.author})`
  ).join('\n');
  
  return `You are analyzing development progress on a GitHub issue.

ISSUE DETAILS:
Title: ${issue.title}
Description: ${issue.body || 'No description'}
Current Estimate: ${currentEstimate.hours} hours
State: ${issue.state}

YESTERDAY'S COMMITS:
${commitSummary}

ANALYSIS TASK:
Based on the commits made yesterday, assess if the original time estimate should be adjusted.

Consider:
1. How much progress was made relative to the estimate?
2. Did commits reveal unexpected complexity?
3. Are there signs the work is taking longer/shorter than expected?
4. Does the work appear on track for completion within the estimate?

RESPONSE FORMAT:
STATUS: [ON_TRACK|AHEAD|BEHIND|BLOCKED]
NEW_ESTIMATE: [number in hours, or KEEP_CURRENT]
REASONING: [brief explanation]

Example:
STATUS: BEHIND
NEW_ESTIMATE: 12
REASONING: Authentication integration more complex than expected, database schema changes required.`;
}

/**
 * Simplified OpenAI API call
 */
async function callOpenAI(prompt, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software development progress analyst.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Parse AI response for progress analysis
 */
function parseProgressAnalysisResponse(response, currentEstimate) {
  const statusMatch = response.match(/STATUS:\s*(\w+)/i);
  const estimateMatch = response.match(/NEW_ESTIMATE:\s*(\d+(?:\.\d+)?|KEEP_CURRENT)/i);
  const reasoningMatch = response.match(/REASONING:\s*(.+)/i);
  
  const status = statusMatch ? statusMatch[1].toUpperCase() : 'UNKNOWN';
  const newEstimateStr = estimateMatch ? estimateMatch[1] : 'KEEP_CURRENT';
  const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'No reasoning provided';
  
  let shouldUpdateEstimate = false;
  let newEstimate = currentEstimate.hours;
  
  if (newEstimateStr !== 'KEEP_CURRENT') {
    const parsedEstimate = parseFloat(newEstimateStr);
    if (!isNaN(parsedEstimate) && parsedEstimate !== currentEstimate.hours) {
      shouldUpdateEstimate = true;
      newEstimate = parsedEstimate;
    }
  }
  
  return {
    status,
    shouldUpdateEstimate,
    newEstimate,
    reasoning,
    originalEstimate: currentEstimate.hours
  };
}

/**
 * Update issue estimate with new values
 */
async function updateIssueEstimate(github, context, issueNumber, newEstimateHours, reasoning) {
  try {
    // Get current issue to access labels
    const { data: issue } = await github.rest.issues.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: parseInt(issueNumber)
    });
    
    // Remove old estimate labels
    const oldEstimateLabels = issue.labels.filter(label => 
      label.name.startsWith('⏱️') || label.name.startsWith('📅 Est:')
    );
    
    for (const label of oldEstimateLabels) {
      try {
        await github.rest.issues.removeLabel({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: parseInt(issueNumber),
          name: label.name
        });
      } catch (error) {
        console.log(`Could not remove label ${label.name}`);
      }
    }
    
    // Add new estimate labels
    const { calculateCompletionDate } = require('./issue-estimator.js');
    const newCompletionDate = calculateCompletionDate(newEstimateHours);
    
    const newTimeLabel = `⏱️ ${Math.ceil(newEstimateHours)}h`;
    const newCompletionLabel = `📅 Est: ${newCompletionDate}`;
    
    await github.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: parseInt(issueNumber),
      labels: [newTimeLabel, newCompletionLabel]
    });
    
    // Post update comment
    const updateComment = `## 🔄 Estimate Updated

**Previous estimate:** ${issue.labels.find(l => l.name.startsWith('⏱️'))?.name || 'Unknown'}  
**New estimate:** ${newTimeLabel}  
**New completion date:** ${newCompletionDate}

**Reason for change:** ${reasoning}

*Updated automatically based on yesterday's progress analysis.*`;
    
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: parseInt(issueNumber),
      body: updateComment
    });
    
    console.log(`✅ Updated estimate for issue #${issueNumber}: ${newTimeLabel}, completion: ${newCompletionDate}`);
    
  } catch (error) {
    console.error(`Error updating estimate for issue #${issueNumber}:`, error);
    throw error;
  }
}

/**
 * Generate daily standup summary comment
 */
async function generateStandupReport(github, context, progressAnalysis) {
  try {
    const summary = createStandupSummary(progressAnalysis);
    
    // Post to metrics tracking issue
    const { data: issues } = await github.rest.issues.listForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
      labels: 'metrics-tracking'
    });
    
    let trackingIssue = issues[0];
    if (!trackingIssue) {
      console.log('No metrics tracking issue found, skipping standup report');
      return;
    }
    
    const reportDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Singapore' // +8 timezone
    });
    
    const standupReport = `## 🌅 Daily Progress Report - ${reportDate}

${summary}

---
*Generated automatically at 7:00 AM +8 for standup preparation*`;
    
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: trackingIssue.number,
      body: standupReport
    });
    
    console.log(`✅ Posted daily standup report to issue #${trackingIssue.number}`);
    
  } catch (error) {
    console.error('Error generating standup report:', error);
  }
}

/**
 * Create standup summary from progress analysis
 */
function createStandupSummary(analysis) {
  if (!analysis.progressAnalysis || Object.keys(analysis.progressAnalysis).length === 0) {
    return `**No active work detected yesterday**
- ${analysis.totalCommits} commits made
- No issues with current estimates were worked on
- All quiet on the development front 🤐`;
  }
  
  const issueUpdates = [];
  const estimateChanges = [];
  
  for (const [issueNumber, issueAnalysis] of Object.entries(analysis.progressAnalysis)) {
    if (issueAnalysis.error) {
      continue;
    }
    
    if (issueAnalysis.shouldUpdateEstimate) {
      estimateChanges.push({
        issue: issueNumber,
        oldEstimate: issueAnalysis.originalEstimate,
        newEstimate: issueAnalysis.newEstimate,
        status: issueAnalysis.status,
        reasoning: issueAnalysis.reasoning
      });
    }
    
    issueUpdates.push(`- Issue #${issueNumber}: ${issueAnalysis.status.toLowerCase()}`);
  }
  
  let summary = `**Yesterday's Development Activity**
- ${analysis.totalCommits} commits across ${analysis.issuesWorkedOn} issues

**Issue Progress:**
${issueUpdates.join('\n')}`;
  
  if (estimateChanges.length > 0) {
    summary += `\n\n**Estimate Adjustments:**\n`;
    for (const change of estimateChanges) {
      summary += `- Issue #${change.issue}: ${change.oldEstimate}h → ${change.newEstimate}h (${change.reasoning.substring(0, 50)}...)\n`;
    }
  } else {
    summary += `\n\n✅ **No estimate adjustments needed** - all work progressing as expected`;
  }
  
  return summary;
}

module.exports = {
  analyzeYesterdayProgress,
  generateStandupReport,
  getYesterdayCommits,
  groupCommitsByIssue,
  extractIssueNumbers,
  analyzeIssueProgress
};