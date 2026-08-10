---
id: cloud
title: Cloud commands
sidebar_label: Cloud
---

All cloud commands require a tenant session unless noted.

```bash
agentpaas cloud login
agentpaas cloud whoami
agentpaas cloud logout
```

`cloud login` opens a browser. Approve in the **same browser** used for the trial claim. Do not put `apc_…` tokens in chat. CI may use `cloud login --token-stdin`.

## Images and deploy

```bash
# pack for cloud first
agentpaas pack ./my-agent --target linux/amd64

agentpaas cloud push --lock ~/.agentpaas/state/agents/<name>/agent.lock
agentpaas cloud images
agentpaas cloud deploy latest
# or: agentpaas cloud deploy --lock <path>

agentpaas cloud deployments
agentpaas cloud undeploy <deployment>
```

## Pull (edit loop)

```bash
agentpaas cloud pull <name-or-id>
agentpaas cloud pull weather-agent --dir ./weather-from-cloud
agentpaas cloud pull weather-agent --bump-version 0.2.0
```

## Secrets

```bash
agentpaas cloud secrets push openrouter
agentpaas cloud secrets list
agentpaas cloud secrets bind <deployment> openrouter --as bearer --host openrouter.ai
agentpaas cloud secrets bindings <deployment>
```

Labels only on list/bindings. Never prints values.

## Invoke and runs

Public invoke (agent or MCP) needs a **deployment invoke token** first.
See [Invoke tokens](./invoke-tokens) for why, and [MCP demos](./mcp-demos) for Hermes and Codex.

```bash
agentpaas cloud invoke-token <deployment>    # dep_… ; prints inv_… once
export AGENTPAAS_CLOUD_INVOKE_TOKEN='inv_…' # or CLI token store

agentpaas cloud invoke <deployment> --body '{"query":"weather in Folsom"}' --wait
agentpaas cloud run <deployment>
agentpaas cloud status <run-id>
agentpaas cloud result <run-id>
agentpaas cloud logs <run-id>
agentpaas cloud events <run-id>
agentpaas cloud cancel <run-id>
```

Bare deployment URLs without `inv_…` return 401. Do not treat `dep_…` as a secret capability.

MCP coding tools use:

```text
https://cloud.agentpaas.ai/v1/deployments/<dep_…>/mcp
Header: X-Agentpaas-Invoke-Token: inv_…
```

Not `/invoke` for Streamable HTTP clients.

## Catalog and usage

```bash
agentpaas cloud registry
agentpaas cloud usage
agentpaas cloud audit
agentpaas cloud metrics
```

## Cron

See [Cron](./cron).

## Agent checklist (cloud weather path)

1. `cloud login` + `whoami`  
2. `pack --target linux/amd64`  
3. `cloud push`  
4. `cloud deploy`  
5. `cloud secrets push` + `bind` to LLM host  
6. `cloud invoke` + `result` / `logs`  
7. Confirm in console **Runs** tab
