# DORA Metrics & Time Estimation Setup Guide

This guide will help you set up the DORA metrics tracking and AI-powered time estimation system for your GitHub repository that integrates with Zenhub.

## 🔧 Prerequisites

- GitHub repository with Issues and Pull Requests enabled
- Zenhub workspace (optional, for enhanced pipeline tracking)
- OpenAI API account for PR-Agent time estimation
- Admin access to repository settings

## 🔑 Required GitHub Secrets

Navigate to your repository → Settings → Secrets and variables → Actions, then add the following secrets:

### 1. OpenAI API Key (Required)
**Secret Name**: `OPENAI_API_KEY`
**Value**: Your OpenAI API key

**How to get it**:
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the generated key (starts with `sk-`)
5. Add it as a repository secret

**Cost**: Approximately $5-20/month depending on usage

### 2. Zenhub API Token (Optional)
**Secret Name**: `ZENHUB_API_KEY`
**Value**: Your Zenhub API token

**How to get it**:
1. Go to [Zenhub API Settings](https://app.zenhub.com/settings/tokens)
2. Generate a new API token
3. Copy the token
4. Add it as a repository secret

**Note**: This is optional. The system will work without Zenhub integration, using GitHub labels instead.

## 🏷️ Required GitHub Labels

Create the following labels in your repository (Issues → Labels → New label):

### Time Tracking Labels
- `⏱️ 1h` (Color: #0052CC)
- `⏱️ 2h` (Color: #0052CC)  
- `⏱️ 4h` (Color: #0052CC)
- `⏱️ 8h` (Color: #0052CC)
- `⏱️ 16h` (Color: #0052CC)
- `⏱️ 32h` (Color: #0052CC)

### Due Date Labels
- `📅 Due: Jan-15` (Color: #FF6B6B)
- `📅 Due: Jan-20` (Color: #FF6B6B)

### Status Labels
- `🟢 On Track` (Color: #00E676)
- `🟡 At Risk` (Color: #FFEB3B)
- `🔴 Overdue` (Color: #F44336)

### Pipeline Labels (if not using Zenhub)
- `icebox` (Color: #E0E0E0)
- `backlog` (Color: #BBDEFB)
- `ready` (Color: #90CAF9)
- `in-progress` (Color: #42A5F5)
- `review` (Color: #FF9800)
- `qa` (Color: #9C27B0)
- `done` (Color: #4CAF50)

### Metrics Labels
- `metrics-tracking` (Color: #795548)
- `dora-metrics` (Color: #607D8B)
- `velocity` (Color: #3F51B5)

## 🔄 Workflow Configuration

The system includes three main workflows:

### 1. PR-Agent Workflow (`pr-agent.yml`)
**Triggers**:
- New pull requests
- PR updates
- Comment commands: `/estimate_time`, `/review`, `/describe`

**Features**:
- Automatic time estimation for PRs
- Code review suggestions
- PR description enhancement
- Time estimate labels
- Due date calculation

### 2. DORA Metrics Workflow (`dora-metrics.yml`)
**Triggers**:
- Weekly schedule (Mondays at 9 AM UTC)
- Manual trigger
- PR merges
- Deployments

**Tracks**:
- Deployment Frequency
- Lead Time for Changes
- Change Failure Rate
- Mean Time to Recovery

### 3. Time Tracker Workflow (`time-tracker.yml`)
**Triggers**:
- Issue state changes
- Daily schedule (10 AM UTC)
- Label changes

**Features**:
- Velocity tracking
- Estimate accuracy analysis
- Pipeline distribution
- Cycle time measurement

## 📊 Data Storage

The system stores metrics data in `.github/data/` directory:
- `dora-metrics.json` - DORA metrics history
- `velocity-data.json` - Velocity and cycle time data

**Note**: This data is stored in the repository. For production use, consider external storage.

## 🚀 Getting Started

1. **Add the required secrets** (see above)
2. **Create the labels** (see above)
3. **Create your first issue** and add a pipeline label (`backlog`, `in-progress`, etc.)
4. **Open a pull request** - PR-Agent will automatically provide time estimates
5. **Use slash commands** in PR comments:
   - `/estimate_time` - Get time estimate
   - `/review` - Get code review
   - `/describe` - Generate PR description

## 📈 Viewing Metrics

Metrics are automatically posted as comments on a special tracking issue with the label `metrics-tracking`. The system will:

1. Create a tracking issue automatically
2. Post weekly DORA metrics reports
3. Post daily velocity analysis
4. Show estimate accuracy reports

## ⚙️ Customization

### Adjusting Working Hours
Edit `.pr_agent.toml` to change:
```toml
WORKING_HOURS_PER_DAY = 6  # Adjust as needed
```

### Changing Report Schedule
Edit the cron schedules in the workflow files:
- DORA metrics: `'0 9 * * 1'` (Mondays 9 AM)
- Velocity tracking: `'0 10 * * *'` (Daily 10 AM)

### Custom Pipeline Mapping
Edit the pipeline mapping in `.pr_agent.toml`:
```toml
[zenhub]
pipeline_mapping = [
    { name = "Your Stage", stage = "custom_stage" },
    # Add your custom stages here
]
```

## 🔍 Troubleshooting

### Common Issues

**1. PR-Agent not working**
- Check that `OPENAI_API_KEY` is set correctly
- Verify the key has sufficient credits
- Check workflow logs in Actions tab

**2. No metrics appearing**
- Ensure the tracking issue exists with `metrics-tracking` label
- Check that workflows have run (Actions tab)
- Verify repository permissions for the workflows

**3. Time estimates not showing**
- Confirm PR-Agent workflow completed successfully
- Check that labels are created correctly
- Look for PR-Agent comments in pull requests

**4. DORA metrics showing zeros**
- Ensure you have sufficient historical data
- Check that deployments/PRs are being tracked
- Verify the time period is appropriate

### Debugging Steps

1. **Check Actions tab** for workflow execution logs
2. **Look for comments** on the metrics tracking issue
3. **Verify secrets** are set in repository settings
4. **Check labels** exist and are spelled correctly
5. **Review workflow files** for syntax errors

## 🎯 Expected Results

After setup, you should see:

- **Automatic time estimates** on new PRs
- **Due date labels** based on estimates
- **Tracking labels** showing if work is on schedule
- **Weekly DORA metrics** posted to tracking issue
- **Daily velocity reports** with team insights
- **Pipeline distribution** showing where work gets stuck

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Verify all secrets and labels are configured
4. Check that PR-Agent service is operational

## 🔄 Updates and Maintenance

The system is designed to be self-maintaining, but you may want to:

- **Monthly**: Review metric reports and adjust processes
- **Quarterly**: Update time estimation accuracy 
- **As needed**: Adjust pipeline labels to match your workflow
- **Regular**: Monitor API usage and costs

---

*This system provides read-only analysis and reporting. It does not automatically modify issues or PRs beyond adding labels and comments.*