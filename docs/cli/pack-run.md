---
id: pack-run
title: Pack and run (local)
sidebar_label: Pack and run
---

Requires a running [daemon](./daemon).

## pack

Build an agent image from a project directory:

```bash
agentpaas pack ./my-agent
agentpaas pack ./my-agent --target linux/amd64
agentpaas pack ./my-agent --name weather --version 1.0.0
```

| Flag | Meaning |
|------|---------|
| `--target` | Platform (use `linux/amd64` for cloud) |
| `--name` / `--version` | Override agent.yaml for this pack |
| `--allow-wildcard` | Allow `domain: '*'` egress (discouraged) |
| `--base-image` | Override base image digest |

Wildcard egress is refused unless `--allow-wildcard` is set.

## run / stop / status / logs

```bash
agentpaas run ./my-agent
agentpaas status
agentpaas status <run-id>
agentpaas logs <run-id>
agentpaas stop <run-id>
```

## Operator helpers

```bash
agentpaas timeline <run-id>
agentpaas summarize <run-id>
agentpaas explain-failure <run-id>
agentpaas next-action
```
