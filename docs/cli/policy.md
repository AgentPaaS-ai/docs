---
id: policy
title: Policy
sidebar_label: Policy
---

```bash
agentpaas policy --help
agentpaas policy init
agentpaas recommend-patch
agentpaas explain-denial
```

Policy files (typically `policy.yaml`) declare **default-deny egress** and related controls. Only approved hostnames should appear on the allow list.

### Agent guidance

- Prefer explicit hosts (`wttr.in`, `openrouter.ai`) over wildcards.  
- After a denial, use `explain-denial` / run audits before widening policy.  
- Repack after policy edits (`agentpaas pack`).

### MCP tools on Cloud

`policy.yaml` can list MCP servers under `mcp_servers` with `url`, optional `allowed_tools`, and optional `denied_tools`. The hostname still needs an egress allow entry.

On AgentPaaS Cloud, host allow is not enough:

- `tools/list` shows only the tools the signed deployment policy allows.
- `tools/call` for a tool that is not allowed, is denied, or is hidden from the list is refused before the tool runs.
- Deny wins. An empty `allowed_tools` list denies every tool on that server.
- Tool names match exactly. Edit policy and redeploy to change the set.

Same story as the policy reference. Console stays read-only.
