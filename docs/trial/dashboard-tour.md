---
id: dashboard-tour
title: Console tour
sidebar_label: Console tour
---

The cloud console at [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) is the human view of your AgentPaaS Cloud account. Use it to see what Hermes pushed, what is deployed, what is running, and what each run did.

All changes go through the AgentPaaS CLI, including deploy, undeploy, adding or rotating secrets and keys, and changing schedules. Run the CLI through an Agent on your Mac using Hermes. The console shows the resulting state for you to review.

## Tabs

| Tab | What you see |
|-----|----------------|
| **Overview** | Trial status, high-level counts |
| **Agents** | Your agent images; expand a row for provenance and details |
| **Deployments** | What is live in the cloud; expand for invoke info |
| **Runs** | History of invokes; expand under the row for summary and events |
| **Cron** | Schedules (view only - ask Hermes to change them) |
| **Secrets** | Labels only (never secret values) |
| **Tokens** | API tokens for automation |
| **Usage / Plan** | Trial usage |

## Tips

- Large lists: filter, page size, and counts sit on the table.  
- Click a row to expand detail **under** that row.  
- After the [guided demo](./guided-demo), you should find your weather agent, a deployment, and at least one run.
