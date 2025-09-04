/**
 * Issue Effort Estimation Script
 * Uses AI to estimate development effort for GitHub issues
 */

/**
 * Estimate effort for a new issue using OpenAI
 */
async function estimateIssueEffort(github, context, issueData, openaiKey) {
  try {
    console.log(`Estimating effort for issue #${issueData.number}: ${issueData.title}`);
    
    // Prepare the estimation prompt
    const prompt = createEstimationPrompt(issueData);
    
    // Call OpenAI API (simplified - in real implementation, use proper OpenAI SDK)
    const estimate = await callOpenAI(prompt, openaiKey);
    
    // Parse the response and validate
    const hours = parseEstimateResponse(estimate);
    
    if (!hours || hours < 0.5 || hours > 80) {
      throw new Error(`Invalid estimate received: ${hours} hours`);
    }
    
    // Calculate estimated completion date
    const completionDate = calculateCompletionDate(hours, issueData);
    
    // Add labels to the issue
    await addEstimateLabels(github, context, issueData.number, hours, completionDate);
    
    // Post estimation comment with reasoning
    await postEstimationComment(github, context, issueData.number, {
      hours,
      completionDate,
      reasoning: estimate.reasoning || "AI analysis of issue complexity"
    });
    
    return { hours, completionDate, success: true };
    
  } catch (error) {
    console.error(`Error estimating issue #${issueData.number}:`, error);
    
    // Add fallback estimate for unknown issues
    await addFallbackEstimate(github, context, issueData.number);
    
    return { success: false, error: error.message };
  }
}

/**
 * Create the AI prompt for estimation
 */
function createEstimationPrompt(issueData) {
  return `You are an expert software developer estimating development effort.

ISSUE DETAILS:
Title: ${issueData.title}
Description: ${issueData.body || 'No description provided'}
Labels: ${issueData.labels?.map(l => l.name).join(', ') || 'None'}

CONTEXT:
This appears to be a ${inferProjectType(issueData)} project based on the repository.

ESTIMATION FACTORS TO CONSIDER:
- Development complexity (coding time)
- Testing requirements (unit + integration tests)
- Code review time 
- Documentation updates
- Integration complexity
- Potential debugging time

INSTRUCTIONS:
Estimate the total development hours needed from start to completion.
Consider that this will be worked on by an experienced developer.
Include time for proper testing and code review in your estimate.

Provide your response in this exact format:
HOURS: [number]
REASONING: [brief explanation of your reasoning]

Example:
HOURS: 6
REASONING: Frontend component with API integration. Includes testing and review time.`;
}

/**
 * Infer project type from repository context (basic heuristic)
 */
function inferProjectType(issueData) {
  // Simple heuristics based on common patterns
  const title = (issueData.title || '').toLowerCase();
  const body = (issueData.body || '').toLowerCase();
  const content = title + ' ' + body;
  
  if (content.includes('frontend') || content.includes('ui') || content.includes('component')) {
    return 'frontend web';
  } else if (content.includes('backend') || content.includes('api') || content.includes('database')) {
    return 'backend';
  } else if (content.includes('mobile') || content.includes('ios') || content.includes('android')) {
    return 'mobile';
  }
  
  return 'web development'; // Default assumption
}

/**
 * Simulate OpenAI API call (replace with actual OpenAI SDK in production)
 */
async function callOpenAI(prompt, apiKey) {
  if (!apiKey) {
    throw new Error('OpenAI API key not provided');
  }
  
  try {
    // In a real implementation, use the OpenAI SDK
    // For now, return a mock response structure
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
            content: 'You are an expert software developer who provides accurate time estimates.'
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
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    return { raw: content };
    
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

/**
 * Parse the AI response to extract hours
 */
function parseEstimateResponse(response) {
  const content = response.raw || '';
  
  // Look for "HOURS: X" pattern
  const hoursMatch = content.match(/HOURS:\s*(\d+(?:\.\d+)?)/i);
  if (hoursMatch) {
    return parseFloat(hoursMatch[1]);
  }
  
  // Fallback: look for any number followed by "hours" or "h"
  const hoursFallback = content.match(/(\d+(?:\.\d+)?)\s*(?:hours?|h)/i);
  if (hoursFallback) {
    return parseFloat(hoursFallback[1]);
  }
  
  // Default fallback for unparseable responses
  console.warn('Could not parse estimate from AI response:', content);
  return 4; // Default to 4 hours
}

/**
 * Calculate estimated completion date based on hours and current workload
 */
function calculateCompletionDate(estimatedHours) {
  const WORKING_HOURS_PER_DAY = 6;
  const workingDaysNeeded = Math.ceil(estimatedHours / WORKING_HOURS_PER_DAY);
  
  const completionDate = new Date();
  let workingDaysAdded = 0;
  
  while (workingDaysAdded < workingDaysNeeded) {
    completionDate.setDate(completionDate.getDate() + 1);
    
    // Skip weekends
    const dayOfWeek = completionDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDaysAdded++;
    }
  }
  
  return completionDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Add estimate labels to the issue
 */
async function addEstimateLabels(github, context, issueNumber, hours, completionDate) {
  const timeLabel = `⏱️ ${Math.ceil(hours)}h`;
  const completionLabel = `📅 Est: ${completionDate}`;
  
  try {
    await github.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      labels: [timeLabel, completionLabel]
    });
    
    console.log(`Added labels to issue #${issueNumber}: ${timeLabel}, ${completionLabel}`);
  } catch (error) {
    console.error(`Error adding labels to issue #${issueNumber}:`, error);
  }
}

/**
 * Post estimation comment with reasoning
 */
async function postEstimationComment(github, context, issueNumber, estimate) {
  const comment = `## 🤖 AI Effort Estimation

**Estimated effort:** ${estimate.hours} hours  
**Estimated completion:** ${estimate.completionDate}

**Reasoning:** ${estimate.reasoning}

*This is an automated estimate that will be updated as work progresses. The completion date assumes current workload and may adjust based on priorities.*`;

  try {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      body: comment
    });
    
    console.log(`Posted estimation comment on issue #${issueNumber}`);
  } catch (error) {
    console.error(`Error posting comment on issue #${issueNumber}:`, error);
  }
}

/**
 * Add fallback estimate when AI fails
 */
async function addFallbackEstimate(github, context, issueNumber) {
  const fallbackHours = 4;
  const completionDate = calculateCompletionDate(fallbackHours);
  
  await addEstimateLabels(github, context, issueNumber, fallbackHours, completionDate);
  
  const comment = `## ⚠️ Fallback Estimation

**Estimated effort:** ${fallbackHours} hours (fallback estimate)
**Estimated completion:** ${completionDate}

*AI estimation failed, using default estimate. Please review and adjust manually if needed.*`;

  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNumber,
    body: comment
  });
}

/**
 * Re-estimate an existing issue (for manual triggers)
 */
async function reEstimateIssue(github, context, issueNumber, openaiKey) {
  try {
    // Get issue details
    const { data: issue } = await github.rest.issues.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber
    });
    
    const issueData = {
      number: issue.number,
      title: issue.title,
      body: issue.body,
      labels: issue.labels
    };
    
    // Remove existing estimate labels
    await removeExistingEstimateLabels(github, context, issueNumber, issue.labels);
    
    // Generate new estimate
    return await estimateIssueEffort(github, context, issueData, openaiKey);
    
  } catch (error) {
    console.error(`Error re-estimating issue #${issueNumber}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove existing estimate labels before re-estimation
 */
async function removeExistingEstimateLabels(github, context, issueNumber, labels) {
  const estimateLabels = labels.filter(label => 
    label.name.startsWith('⏱️') || label.name.startsWith('📅 Est:')
  );
  
  for (const label of estimateLabels) {
    try {
      await github.rest.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        name: label.name
      });
    } catch (error) {
      // Label might not exist, continue
      console.log(`Could not remove label ${label.name} from issue #${issueNumber}`);
    }
  }
}

module.exports = {
  estimateIssueEffort,
  reEstimateIssue,
  calculateCompletionDate,
  createEstimationPrompt,
  parseEstimateResponse
};