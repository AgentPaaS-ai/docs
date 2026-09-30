---
id: policy-inspection
title: Policy inspection and MCP tool controls
sidebar_label: Policy inspection
---

# Policy inspection and MCP tool controls

Inspect the policy that pack and deployment will enforce before you run an agent. Cloud uses the signed compiled policy as the source of truth for egress, credentials, and MCP tools.

## Inspect locally

Run both commands after packing or when checking a policy change:

```bash
agentpaas policy show
agentpaas policy validate
```

`policy show` renders the compiled contract for a packed or deployed target. `policy validate` performs the same compilation as a pre-deploy dry run. Credentials appear as IDs, never values.

## Restrict MCP tools

Declare the MCP server and its exact tool set in `policy.yaml`:

```yaml
mcp_servers:
  - url: https://mcp.example.com
    allowed_tools:
      - read_issue
      - list_issues
    denied_tools:
      - delete_issue
```

On Cloud:

- `tools/list` returns only tools allowed for the deployment.
- `tools/call` is denied before the upstream server is contacted when the tool is missing from `allowed_tools`, listed in `denied_tools`, or hidden from `tools/list`.
- `denied_tools` takes precedence over `allowed_tools`.
- An empty `allowed_tools` list denies every tool on that server.
- Change the policy and redeploy to change the tool set.

A denied call returns HTTP `403` and is recorded in the run audit. Verify the exact response body from the deployment endpoint when writing client-specific error handling.

## Read the Cloud views

The Cloud console exposes the same compiled contract through read-only views:

- Gateway Policy.
- Policy details on a deployment.
- Egress decisions from run activity.
- Policy and deployment digests.
- Event-type filters in Logs.

The console does not edit policy. Change the project policy, repack, and redeploy.

See [LLM governance](./llm-governance) for budgets, PII handling, model aliases, OAuth LLM credentials, and usage behavior.
