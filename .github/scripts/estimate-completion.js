/**
 * Estimate Completion Date Calculator
 * Calculates expected completion dates based on time estimates and team velocity
 */

const fs = require('fs');
const path = require('path');

// Configuration
const WORKING_HOURS_PER_DAY = 6;
const WORK_DAYS_PER_WEEK = 5;
const VELOCITY_BUFFER = 1.2; // 20% buffer for unexpected work

/**
 * Extract hours from time estimate labels
 */
function extractHoursFromLabels(labels) {
  for (const label of labels) {
    const match = label.name.match(/⏱️\s*(\d+(?:\.\d+)?)h?/);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  return null;
}

/**
 * Calculate expected completion date
 */
function calculateCompletionDate(estimatedHours, teamVelocity = WORKING_HOURS_PER_DAY) {
  const adjustedHours = estimatedHours * VELOCITY_BUFFER;
  const daysNeeded = Math.ceil(adjustedHours / teamVelocity);
  
  const completionDate = new Date();
  let addedDays = 0;
  
  while (addedDays < daysNeeded) {
    completionDate.setDate(completionDate.getDate() + 1);
    
    // Skip weekends
    if (completionDate.getDay() !== 0 && completionDate.getDay() !== 6) {
      addedDays++;
    }
  }
  
  return completionDate;
}

/**
 * Get team velocity based on historical data
 */
async function getTeamVelocity(github, context) {
  try {
    // Get closed issues from last 30 days with time estimates
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: issues } = await github.rest.issues.listForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
      since: thirtyDaysAgo.toISOString(),
      per_page: 100
    });
    
    let totalHours = 0;
    let completedIssues = 0;
    
    for (const issue of issues) {
      const estimatedHours = extractHoursFromLabels(issue.labels);
      if (estimatedHours) {
        totalHours += estimatedHours;
        completedIssues++;
      }
    }
    
    if (completedIssues === 0) return WORKING_HOURS_PER_DAY;
    
    // Calculate daily velocity
    const daysInPeriod = Math.min(30, Math.ceil((new Date() - thirtyDaysAgo) / (1000 * 60 * 60 * 24)));
    const workingDays = Math.floor(daysInPeriod * (WORK_DAYS_PER_WEEK / 7));
    
    return totalHours / workingDays;
  } catch (error) {
    console.error('Error calculating team velocity:', error);
    return WORKING_HOURS_PER_DAY; // Default fallback
  }
}

/**
 * Check if current estimates are on track
 */
async function checkOnTrackStatus(github, context) {
  const { data: issues } = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open',
    per_page: 100
  });
  
  const results = [];
  
  for (const issue of issues) {
    const estimatedHours = extractHoursFromLabels(issue.labels);
    if (!estimatedHours) continue;
    
    const dueDateLabel = issue.labels.find(label => label.name.startsWith('📅 Due:'));
    if (!dueDateLabel) continue;
    
    const dateMatch = dueDateLabel.name.match(/📅 Due: (.+)/);
    if (!dateMatch) continue;
    
    const dueDate = new Date(dateMatch[1]);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    let status = 'on-track';
    if (daysUntilDue < 0) {
      status = 'overdue';
    } else if (daysUntilDue < 2) {
      status = 'at-risk';
    }
    
    results.push({
      number: issue.number,
      title: issue.title,
      estimatedHours,
      dueDate: dueDate.toLocaleDateString(),
      daysUntilDue,
      status
    });
  }
  
  return results;
}

/**
 * Update issue labels based on tracking status
 */
async function updateTrackingLabels(github, context, trackingData) {
  for (const item of trackingData) {
    const labelsToRemove = ['🟢 On Track', '🟡 At Risk', '🔴 Overdue'];
    let labelToAdd = '';
    
    switch (item.status) {
      case 'on-track':
        labelToAdd = '🟢 On Track';
        break;
      case 'at-risk':
        labelToAdd = '🟡 At Risk';
        break;
      case 'overdue':
        labelToAdd = '🔴 Overdue';
        break;
    }
    
    try {
      // Remove existing tracking labels
      for (const label of labelsToRemove) {
        try {
          await github.rest.issues.removeLabel({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: item.number,
            name: label
          });
        } catch (error) {
          // Label might not exist, continue
        }
      }
      
      // Add new tracking label
      if (labelToAdd) {
        await github.rest.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: item.number,
          labels: [labelToAdd]
        });
      }
    } catch (error) {
      console.error(`Error updating labels for issue #${item.number}:`, error);
    }
  }
}

/**
 * Check estimate accuracy for completed issues
 */
async function checkEstimateAccuracy(github, context) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: closedIssues } = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'closed',
    since: thirtyDaysAgo.toISOString(),
    per_page: 100
  });
  
  let totalEstimates = 0;
  let accurateEstimates = 0;
  let totalVariance = 0;
  const variances = [];
  
  for (const issue of closedIssues) {
    const estimatedHours = extractHoursFromLabels(issue.labels);
    if (!estimatedHours) continue;
    
    const createdDate = new Date(issue.created_at);
    const closedDate = new Date(issue.closed_at);
    
    // Calculate working days between creation and closure
    let workingDays = 0;
    let currentDate = new Date(createdDate);
    
    while (currentDate < closedDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const actualHours = workingDays * WORKING_HOURS_PER_DAY;
    const variance = Math.abs(estimatedHours - actualHours);
    const accuracyThreshold = estimatedHours * 0.25; // 25% tolerance
    
    totalEstimates++;
    totalVariance += variance;
    variances.push(variance);
    
    if (variance <= accuracyThreshold) {
      accurateEstimates++;
    }
  }
  
  if (totalEstimates === 0) {
    return {
      overallAccuracy: 0,
      totalEstimates: 0,
      onTimeCompletions: 0,
      averageVariance: 0,
      recommendations: ['Not enough historical data for accuracy analysis']
    };
  }
  
  const overallAccuracy = Math.round((accurateEstimates / totalEstimates) * 100);
  const averageVariance = Math.round(totalVariance / totalEstimates * 10) / 10;
  
  const recommendations = [];
  if (overallAccuracy < 70) {
    recommendations.push('Consider breaking down larger tasks into smaller, more predictable chunks');
    recommendations.push('Review estimation process and gather more detailed requirements');
  }
  if (averageVariance > estimatedHours * 0.3) {
    recommendations.push('Add more buffer time for complex tasks');
    recommendations.push('Improve understanding of task complexity before estimation');
  }
  if (overallAccuracy > 85) {
    recommendations.push('Great estimation accuracy! Consider documenting your process');
  }
  
  return {
    overallAccuracy,
    totalEstimates,
    onTimeCompletions: accurateEstimates,
    averageVariance,
    recommendations
  };
}

module.exports = {
  extractHoursFromLabels,
  calculateCompletionDate,
  getTeamVelocity,
  checkOnTrackStatus,
  updateTrackingLabels,
  checkEstimateAccuracy
};