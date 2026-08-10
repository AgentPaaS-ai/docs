---
id: mcp-demos
title: MCP demos (Hermes and Codex)
sidebar_label: MCP demos
---

End-to-end demos for a **hosted MCP** deployment on AgentPaaS Cloud.
No console UX changes required. You need a logged-in CLI and one `dep_…`.

Prerequisites: [Invoke tokens](./invoke-tokens) (why `inv_…` exists).

## Shared setup (once)

```bash
export AGENTPAAS_CLOUD_URL=https://cloud.agentpaas.ai
agentpaas cloud login
agentpaas cloud whoami
agentpaas cloud deployments
# note kind=mcp deployment id, e.g. dep_…
```

Pack and deploy an MCP package if you do not have one yet (`kind: mcp_service` in the package, then `cloud push` and deploy with MCP kind). Demo package path used in founder gates:

```text
# example local tree (builders)
~/projects/agentpaas/local/demo-mcp-fetch
```

Mint an invoke token for that deployment:

```bash
agentpaas cloud invoke-token dep_REPLACE
# store inv_… in a 600-permission file or env; shown once
export AGENTPAAS_MCP_FETCH_TOKEN='inv_…'
```

Optional prove without any IDE:

```bash
curl -sS -X POST \
  "https://cloud.agentpaas.ai/v1/deployments/dep_REPLACE/mcp" \
  -H "Content-Type: application/json" \
  -H "X-Agentpaas-Invoke-Token: $AGENTPAAS_MCP_FETCH_TOKEN" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"demo","version":"1"}}}'
```

You want JSON-RPC `serverInfo` and **no** bare `run_id` envelope. Use path **`/mcp`**, not `/invoke`, for coding tools.

---

## Demo A: Codex / ChatGPT desktop

Codex and ChatGPT desktop share MCP config under `~/.codex/config.toml` (see [OpenAI MCP docs](https://developers.openai.com/codex/mcp/)).

### Streamable HTTP (recommended)

```toml
[mcp_servers.agentpaas_fetch]
url = "https://cloud.agentpaas.ai/v1/deployments/dep_REPLACE/mcp"
startup_timeout_sec = 60
tool_timeout_sec = 120
enabled = true
# Prefer env so the token is not duplicated in every screenshot:
# env_http_headers = { "X-Agentpaas-Invoke-Token" = "AGENTPAAS_MCP_FETCH_TOKEN" }
http_headers = { "X-Agentpaas-Invoke-Token" = "inv_PASTE_HERE" }
```

Or UI: **Settings → MCP servers → Add → Streamable HTTP**, same URL and header.

Fully quit and reopen the desktop app. Confirm the server is **listed and enabled** (not merely mentioned in chat history).

### Prompt

```
List tools from agentpaas_fetch, then call fetch on https://example.com.
Show the tool result. Do not invent the page.
```

Success looks like tool output with Example Domain text and `status: 200` when the package egress allows `example.com`.

### Notes

- ChatGPT **web** does not read `~/.codex/config.toml`. Use desktop/Codex for this demo.
- If the model says `not_installed`, the server is missing from config or disabled. Check `grep agentpaas_fetch ~/.codex/config.toml`.
- Wrong URL `/invoke` fails MCP `initialize`. Always `/mcp` for this demo.

---

## Demo B: Hermes

Hermes should use the same tenant login and the same `dep_…` / `inv_…` split.

### Operator flow (human in the loop for secrets)

1. User runs `agentpaas cloud login` in a terminal (Hermes does not paste `apc_…` into chat).
2. Hermes runs `agentpaas cloud whoami` and `agentpaas cloud deployments` / `cloud registry`.
3. Hermes (or user) runs `agentpaas cloud invoke-token dep_REPLACE` in the user terminal; user keeps `inv_…` out of the model transcript when possible.
4. Call the MCP façade or CLI:

```bash
# JSON-RPC tools/call via HTTP
curl -sS -X POST \
  "https://cloud.agentpaas.ai/v1/deployments/dep_REPLACE/mcp" \
  -H "Content-Type: application/json" \
  -H "X-Agentpaas-Invoke-Token: $AGENTPAAS_MCP_FETCH_TOKEN" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"fetch","arguments":{"url":"https://example.com","max_length":500}}}'
```

Or agent-style invoke when the deployment supports it:

```bash
export AGENTPAAS_CLOUD_INVOKE_TOKEN="$AGENTPAAS_MCP_FETCH_TOKEN"
agentpaas cloud invoke dep_REPLACE \
  --body '{"tool":"fetch","arguments":{"url":"https://example.com"}}' \
  --wait
```

5. Confirm in console **Runs**: status succeeded and reply/final_output for the tool.

### Hermes NL prompts (examples)

```
Using my AgentPaaS cloud login, list deployments and find kind=mcp.
Help me mint an invoke token for that dep_ id in my terminal.
Then call fetch on https://example.com via the /mcp URL and summarize the result.
```

Hermes must not invent weather or tool bodies when the run errors. Read real invoke/run status.

---

## Security reminder

- Mint with logged-in CLI + `dep_…`.
- Public callers hold only `inv_…`.
- Platform stores hash + prefix, not the full token.
- Details: [Invoke tokens](./invoke-tokens).

## Related

- [Cloud commands](./cloud)
- [Invoke tokens](./invoke-tokens)
- [Policy](./policy)
