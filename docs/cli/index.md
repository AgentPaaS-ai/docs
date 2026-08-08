---
id: index
title: AgentPaaS CLI
sidebar_label: Overview
---

The **AgentPaaS CLI** (`agentpaas`) is the full control surface for local agents and AgentPaaS Cloud. Humans and coding agents (Hermes and others) should prefer these commands when they need precise, repeatable setup.

**Current brew line:** 0.3.7+ (`agentpaas version`)

## How to use this section

| Path | Start here |
|------|------------|
| First time on a Mac | [Install](./install) → [Daemon](./daemon) → [Doctor](./doctor) |
| Build and run locally | [Projects](./projects) → [Pack and run](./pack-run) |
| Keys and identity | [Secrets](./secrets) → [Identity and trust](./identity-trust) |
| Policy and audits | [Policy](./policy) → [Audit and lineage](./audit-lineage) |
| Cloud | [Cloud](./cloud) |
| Scheduling | [Cron](./cron) |
| Machine-readable output | Every command accepts global `--json` |

Trial users who only want the happy path can stay on the [Guided demo](/trial/guided-demo). This CLI section is the detailed reference.

## Command map

### Local runtime

| Command | Purpose |
|---------|---------|
| `agentpaas version` | CLI / daemon version stamps |
| `agentpaas doctor` | Health checks |
| `agentpaas daemon …` | Start/stop control daemon |
| `agentpaas init` | Scaffold a project |
| `agentpaas validate` | Check project layout |
| `agentpaas pack` | Build signed image |
| `agentpaas run` / `stop` / `status` / `logs` | Local lifecycle |
| `agentpaas secret …` | Local Keychain secrets (labels only on list) |
| `agentpaas identity …` / `trust …` | Publisher keys |
| `agentpaas policy …` | Policy helpers |
| `agentpaas audit …` / `provenance` | Audits and lineage |
| `agentpaas install` / `installed` / `export` / `fork` / `bundle` | Bundles and sharing |
| `agentpaas cron …` | Local schedules |
| `agentpaas deploy …` | Local deploy aliases (state) |
| `agentpaas trigger …` | Local triggers |

### Cloud (`agentpaas cloud …`)

| Command | Purpose |
|---------|---------|
| `login` / `logout` / `whoami` | Tenant session |
| `push` / `pull` | Image up/down |
| `deploy` / `undeploy` / `deployments` / `images` | Live slots |
| `invoke` / `invoke-token` / `run` / `status` / `result` / `logs` / `events` / `cancel` | Runs |
| `secrets …` | Push/list/bind (never print values) |
| `cron …` | Cloud schedules |
| `registry` / `usage` / `audit` / `metrics` | Catalog and ops |

## Global flags

```text
--home string      AgentPaaS home (default ~/.agentpaas)
--socket string    Daemon socket
--json             Machine-readable JSON on stdout
-h, --help
```

Agents should pass `--json` when parsing output.
