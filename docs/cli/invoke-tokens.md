---
id: invoke-tokens
title: Invoke tokens (agents and MCP)
sidebar_label: Invoke tokens
---

Public calls to a **deployment** (agent or MCP) need a deployment invoke token (`inv_…`).
Your logged-in CLI session uses a **tenant** token (`apc_…`). Those are different.

## Two credentials

| Credential | Looks like | Used for |
|------------|------------|----------|
| Tenant API session | `apc_…` (Keychain after `cloud login`) | whoami, push, deploy, mint, list |
| Deployment invoke token | `inv_…` | Public HTTP invoke and MCP (`/invoke`, `/mcp`) |

Mint only works while the CLI is logged in. You pass the **deployment id** (`dep_…`), not a bare URL.

```bash
agentpaas cloud login          # once; browser claim/return path
agentpaas cloud whoami
agentpaas cloud deployments    # copy dep_…

agentpaas cloud invoke-token dep_REPLACE
# prints inv_… once. Store it; do not commit; do not paste into chat if you can avoid it
```

Then either:

```bash
# CLI stores or accepts token for agent-style invoke
export AGENTPAAS_CLOUD_INVOKE_TOKEN='inv_…'
agentpaas cloud invoke dep_REPLACE --body '{"query":"…"}' --wait
```

or send HTTP yourself:

```bash
curl -sS -X POST \
  "https://cloud.agentpaas.ai/v1/deployments/dep_REPLACE/invoke" \
  -H "Content-Type: application/json" \
  -H "X-Agentpaas-Invoke-Token: inv_…" \
  -d '{"query":"…"}'
```

For **MCP coding tools** (Codex, ChatGPT desktop), use the MCP façade URL and the same header (or Bearer with the same `inv_…` value):

```text
https://cloud.agentpaas.ai/v1/deployments/dep_REPLACE/mcp
Header: X-Agentpaas-Invoke-Token: inv_…
```

See [MCP demos (Hermes and Codex)](./mcp-demos).

## Why mint first (not “just the dep_ id”)

- **`dep_…` is not a secret.** Listing deployments is a normal tenant operation. Anyone who only knew `dep_…` must not be able to run your workload.
- **`inv_…` is the capability** to trigger that deployment over the public edge. Minting is an explicit step after you are authenticated as the tenant.
- **Rotate without rotating login.** Lose a laptop clipboard token? Mint again. Old `inv_…` stops working. Your `cloud login` session can stay.
- **Scope is one deployment.** An invoke token is bound to one `dep_…`, not the whole tenant catalog.

## What the platform stores

| Stored on the deployment row | Not stored |
|------------------------------|------------|
| SHA-256 **hash** of `inv_…` | Full `inv_…` string |
| Short **prefix** (first 8 characters) for support display | Ability to “show me the token again” |

Mint response message is intentional: **shown once**. If you lose it, mint a new one (rotates).

Revoke clears hash and prefix so public calls fail until you mint again.

## How this is secure

1. **Default deny at the edge.** `POST /v1/deployments/:id/invoke` and `…/mcp` without a valid `inv_…` return **401**. A bare deployment URL is not enough.
2. **Hash at rest.** Compromise of database rows does not yield usable invoke tokens.
3. **Tenant mint path.** Only an authenticated tenant principal (CLI session or API token with rights) can mint or revoke for their own `dep_…`.
4. **Separation of duties.** Day-to-day coding tools and webhooks hold `inv_…` only. They never need `apc_…` or Cloudflare credentials.
5. **Audit-friendly.** Runs still appear under your tenant in the console. Tokens are not a back door around tenancy.

## What not to do

- Do not put `inv_…` or `apc_…` in git, screenshots, or public issues.
- Do not treat the console deploy URL alone as the “API key.”
- Do not reuse one `inv_…` across tenants or across unrelated deployments.
- Do not expect the dashboard to re-display the full token (by design).

## Related

- [Cloud commands](./cloud)
- [MCP demos (Hermes and Codex)](./mcp-demos)
- [Secrets](./secrets) (brokered labels; different from invoke tokens)
