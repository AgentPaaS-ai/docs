---
id: dashboard-tour
title: Console tour
sidebar_label: Console tour
---

The cloud console at [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) is where you **see** what happened after Hermes builds and deploys agents.

It is mostly read-only for day-to-day work. You change things by asking Hermes (or using the CLI if you prefer). Tokens and Secrets forms in the UI are fine when you need them.

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
