---
id: what-is-agentpaas
slug: /trial/what-is-agentpaas
title: What is AgentPaaS?
sidebar_label: What is AgentPaaS?
---

AgentPaaS is an open-source runtime for **agent security**. AI agents can be steered by poisoned prompts, risky dependencies, or generated code - so the platform assumes the agent itself may be untrusted. You run that workload in isolated containers with default-deny egress, brokered credentials, and tamper-evident audit, instead of giving a free-form agent the keys to your environment.

On your Mac, the CLI packs and runs agents under local policy. On [AgentPaaS Cloud](https://cloud.agentpaas.ai/), you push, deploy, invoke, and schedule the same kind of governed agents. Start from the [trial guide](/trial/) with a claim link from AgentPaaS, or request access on [agentpaas.ai](https://agentpaas.ai/).

## Surfaces

| Surface | What you get |
|---------|----------------|
| **Local (macOS)** | `agentpaas` CLI, daemon, and Docker/Colima - build, pack, and run on your machine |
| **Cloud** | Managed console and API at [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) - push, deploy, invoke, cron |

## Supported platforms

| | Supported today |
|--|-----------------|
| **Local runtime** | macOS (Apple Silicon and Intel with Docker/Colima) |
| **CLI install** | Homebrew cask (`AgentPaaS-ai/homebrew-tap`) |
| **Cloud** | Browser console + API (invite-gated trial) |
| **LLM access** | Bring your own key (OpenRouter and other HTTPS providers via policy/egress) |
| **Agents** | Pack and run project-based agents with signed images and audit |

Next: [Guided demo](./guided-demo).

## How security is enforced

Policy is topology: the agent only reaches the internet through a default-deny gateway. See the diagram and walkthrough in [How enforcement works](/security/how-enforcement-works).

Next: [Guided demo](./guided-demo).
