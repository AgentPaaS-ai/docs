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

## Ingress

Ingress connects an external app to one or more deployed agents. The source
owns the external app and its Request URL. A connection selects the deployment
that wakes for matching events.

Use the `cloud ingress` commands for inbound sources and connections. The
Slack source Request URL returned by `source create` has this form after this
cut:

```text
https://cloud.agentpaas.ai/v1/hooks/src_01J...
```

Create a Slack source. Pipe the signing secret to standard input. The CLI
prints the source ID and Request URL, never the secret.

```bash
printf '%s' "$SLACK_SIGNING_SECRET" | agentpaas cloud ingress source create --provider slack --label "support bot" --secret-stdin
```

Connect a deployment to the source. The filter is optional. This example
accepts events from channel `C0123`.

```bash
agentpaas cloud ingress connect src_01JEXAMPLE dep_01JEXAMPLE --label "support triage" --filter '{"match":"all","rules":[{"field":"event.channel","op":"eq","value":"C0123"}]}'
```

Bind the Slack bot credential when the agent must reply in a thread.

```bash
printf '%s' "$SLACK_BOT_TOKEN" | agentpaas cloud ingress source bind-reply src_01JEXAMPLE --credential slack-bot-token --secret-stdin
```

List sources and inspect the connections attached to a source.

```bash
agentpaas cloud ingress sources
agentpaas cloud ingress connections src_01JEXAMPLE
```

Disable a source to pause its inbound events, or disable one connection to
stop that subscription while leaving the source available to other
connections.

```bash
agentpaas cloud ingress source disable src_01JEXAMPLE
agentpaas cloud ingress connection disable con_01JEXAMPLE
```

Rotate a source signing secret. Pipe the replacement secret to standard input.

```bash
printf '%s' "$NEW_SLACK_SIGNING_SECRET" | agentpaas cloud ingress source rotate src_01JEXAMPLE --secret-stdin
```

Inspect recent events for a source. The `--tail` value limits the displayed
events.

```bash
agentpaas cloud ingress events src_01JEXAMPLE --tail 20
```

Test a filter without admitting an event. The command returns whether the
event matched.

```bash
agentpaas cloud ingress test-filter src_01JEXAMPLE --filter '{"match":"all","rules":[{"field":"event.channel","op":"eq","value":"C0123"}]}' --event '{"event":{"channel":"C0123"}}'
```

Use `--secret-stdin` for source creation, reply binding, and rotation. Never
put a secret in a command argument or paste one into chat. AgentPaaS does not
print source secrets or reply tokens.

`cloud webhook` remains the command group for outbound completion and delivery
webhooks, plus the legacy deployment webhook doorbell. It does not configure
the source and connection ingress plane described above.

## Agent checklist (cloud weather path)

1. `cloud login` + `whoami`  
2. `pack --target linux/amd64`  
3. `cloud push`  
4. `cloud deploy`  
5. `cloud secrets push` + `bind` to LLM host  
6. `cloud invoke` + `result` / `logs`  
7. Confirm in console **Runs** tab
