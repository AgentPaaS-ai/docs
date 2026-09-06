---
id: index
slug: /
title: AgentPaaS documentation
---

AgentPaaS.ai is the secure PaaS for agents, apps, MCP servers, and agentic workflows. You can deploy your enterprise agentic integration workflows securely at scale, with end-to-end auditability and governance.

# AgentPaaS documentation

Welcome to AgentPaaS.ai Documentation - The Agent Platform as a Service, and the Opensource AgentPaaS CLI.

> **Learn with Athena:** If you want help understanding AgentPaaS or using the platform, ask Athena, the integrated Hermes chatbot in your tenancy. Try asking, “How do I build an agent?”

## Get your free trial

Click any **Start free trial** button on the [AgentPaaS.ai](https://agentpaas.ai/) landing page. You will find one in the hero section, the Individual pricing card, and the footer. Complete the form with your name and work email, select **Free trial**, then click **Send**. Within a few minutes, check your inbox for an email from `freetrial@agentpaas.ai`. It contains the one-time claim link for setting your password and accessing your trial.

The free trial lasts 30 days, requires no card, and includes the Individual tier: up to 10 Agents/MCPs/Tools, 5 concurrent runs, and 100 CPU-minutes.

## CLI version

| Version | Status |
|---------|--------|
| **[v0.4.0](./releases/v0.4.0)** | Current (`agentpaas version` → `CLI: 0.4.0+`) |

## Start here

| | |
|--|--|
| AgentPaaS | [What is AgentPaaS?](./trial/what-is-agentpaas), [Get your free trial](./trial/) and [Agent Guided Demo](./trial/guided-demo) |
| AgentPaaS CLI | [CLI overview](./cli/) |
| What shipped | [Release notes v0.4.0](./releases/v0.4.0) |
|| Cloud console | [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) |
|| Product home | [agentpaas.ai](https://agentpaas.ai/) |

## Raw Markdown for agents

Every documentation page is also served as raw Markdown for programmatic
readers. Append `.md` to any page path:

```
https://docs.agentpaas.ai/security/threat-model        -> styled HTML
https://docs.agentpaas.ai/security/threat-model.md     -> raw Markdown (text/markdown)
```

Agents and retrieval tools should fetch the `.md` form. The content is
identical; only the rendering differs.
