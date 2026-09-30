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

After a successful login, the CLI remembers the Cloud API URL in its local AgentPaaS configuration. Set `AGENTPAAS_CLOUD_API_URL` to override it for one or more commands. `agentpaas cloud logout` clears the saved URL. This matters when moving between staging and production.

## Images and deploy

```bash
# pack for cloud first
agentpaas pack ./my-agent --target linux/amd64

agentpaas cloud push --lock ~/.agentpaas/state/agents/<name>/agent.lock
agentpaas cloud images
agentpaas cloud deploy latest
# or: agentpaas cloud deploy --lock <path>

agentpaas cloud deployments
agentpaas cloud undeploy <deployment> --yes --confirm-id <deployment>
agentpaas cloud images delete <img_or_sha256> --yes --confirm-id <img_or_sha256>
```

These commands require `--yes`, including with `--json`. In a non-TTY, pass `--confirm-id` with the exact deployment id, image id, or image digest. In a TTY, the CLI prompts you to type that same value, even when `--yes` is present. Run destructive commands in your own terminal. They are designed to reject agent-mediated confirmation.

`cloud undeploy` deletes live compute, removes the deployment's secret bindings, and frees the deployment slot. A workflow that refers to the deployment remains stored, but a later run fails with `deployment_not_found` until you redeploy the component and restore its bindings.

`cloud images delete` removes an admitted image by image id or `sha256:` digest. It does not undeploy a deployment. If the image is still referenced, the API returns HTTP 409 and the CLI prints an `agentpaas cloud undeploy <dep_> --yes --confirm-id <dep_>` command for each blocking deployment. Undeploy those deployments, then retry the image deletion.

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
agentpaas cloud secrets delete <name> --yes --confirm-id <name>
```

Labels only on list, bindings, and delete operations. Never prints values. `cloud secrets delete` requires `--yes` and the same TTY or non-TTY `--confirm-id` rule described above. If the secret is bound to deployments, the API returns HTTP 409 and the CLI prints the bound deployment ids. Remove the bindings and retry, or pass `--force` when you intend to delete the bound secret. Deleting it removes the cloud secret label and its value from the cloud secret store.

## Workflows

```bash
agentpaas cloud workflow retire <wf_id> --yes --confirm-id <wf_id>
```

Retiring a workflow calls `POST /v1/workflows/:id/retire`. It retires the stored workflow recipe and does not delete in-use instances. If instances are still running, the API returns HTTP 409 and the CLI prints the in-use instance ids. Stop or hang up those instances, then retry. The command requires `--yes` and the same TTY or non-TTY `--confirm-id` rule described above.

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

## Usage and cost

Cloud records gateway-observed LLM usage for a run. The console Usage and Plan view shows tenant usage, and run details show the usage and cost recorded for that run. The workload cannot submit arbitrary usage values to change the record.

Use the CLI to inspect tenant usage:

```bash
agentpaas cloud usage
```

## Cron

See [Cron](./cron).

## Ingress

Use [Ingress through the gateway](../trial/ingress) to connect Slack, Stripe, GitHub, or a compatible HMAC-signed JSON sender to a Cloud deployment.

```bash
agentpaas cloud ingress source delete <src_id> --yes --confirm-id <src_id>
```

Deleting an ingress source calls `DELETE /v1/ingress/sources/:id`. It does not automatically disable connections. If enabled connections still reference the source, the API returns HTTP 409 and the CLI prints `agentpaas cloud ingress connection disable <con_>` for each blocker. Disable those connections, then retry. The command requires `--yes` and the same TTY or non-TTY `--confirm-id` rule described above. Signing secrets are never printed.

## Agent checklist (cloud weather path)

1. `cloud login` + `whoami`  
2. `pack --target linux/amd64`  
3. `cloud push`  
4. `cloud deploy`  
5. `cloud secrets push` + `bind` to LLM host  
6. `cloud invoke` + `result` / `logs`  
7. Confirm in console **Runs** tab
