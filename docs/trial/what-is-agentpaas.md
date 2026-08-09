---
id: what-is-agentpaas
slug: /trial/what-is-agentpaas
title: What is AgentPaaS?
sidebar_label: What is AgentPaaS?
---
{/* <!-- COPY TWIN: oss/docs/customer/trial/01-what-agentpaas-is.md — change both or neither (D-W7) --> */}

AgentPaaS is a secure execution platform for agentic workflows. It runs AI agents you can't trust: agents can be steered by poisoned prompts, risky dependencies, or their own generated code, so the platform assumes the agent itself may be compromised. Every agent runs in an isolated container, behind default-deny egress, with gateway-brokered credentials and a tamper-evident audit trail.

Build, test, and run agents locally with the open-source CLI (macOS). Deploy the same governed agents to [AgentPaaS Cloud](https://cloud.agentpaas.ai/) in one command. Start from the [trial guide](/trial/) with a claim link, or request access on [agentpaas.ai](https://agentpaas.ai/).

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

## How security is enforced

Policy is topology: the agent only reaches the internet through a default-deny gateway. See the diagram and walkthrough in [How enforcement works](/security/how-enforcement-works).

Next: [Guided demo](./guided-demo).
