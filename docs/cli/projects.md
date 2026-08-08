---
id: projects
title: Projects
sidebar_label: Projects
---

## init

Scaffold a new agent project:

```bash
agentpaas init ./my-agent
agentpaas init ./my-agent --noninteractive
```

## validate

```bash
agentpaas validate ./my-agent
```

Checks layout and pack readiness without building.

## Typical layout

- `agent.yaml` - name, version, runtime hints  
- `policy.yaml` - egress and capabilities  
- entry module (for example `main.py`) with invoke handler  

Prefer the Hermes authoring flow for first projects; use these commands when automating or repairing.
