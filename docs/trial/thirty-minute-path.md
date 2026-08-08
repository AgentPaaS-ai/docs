---
id: thirty-minute-path
title: The 30-minute path
---

End-to-end trial map. Detail pages are linked from each step.

1. Open your **claim link** (email from AgentPaaS) → set password → optional Google link 
 → [Claim](./claim-your-trial) · [Sign in](./sign-in-and-sessions)
2. Install Hermes and the AgentPaaS plugin 
 → [Install](./install-macos) · [Hermes](./hermes-plugin)
3. In Hermes paste: 
 `Install from https://github.com/AgentPaaS-ai/agentpaas`
4. Paste: 
 `Build a weather agent that uses an LLM, and responds in a friendly demeanour` 
 Use **OpenRouter** + a cheap model. Store key via terminal stdin. 
 → [LLM key](./llm-key)
5. Local check: `Show me lineage and audits`
6. Cloud: `Make it run in the AgentPaaS cloud` 
 When asked to log in, **you** run `agentpaas cloud login` in your own terminal. 
 → [Cloud login](./cloud-login)
7. Open https://cloud.agentpaas.ai: Agents, Deployments, Runs, Cron, Usage 
 → [Dashboard](./dashboard-tour)
8. Optional schedule: 
 `agentpaas cloud cron set <deployment> --expr every_5m` 
 → [Cron](./cloud-cron)

If stuck: [Troubleshooting](./troubleshooting)
