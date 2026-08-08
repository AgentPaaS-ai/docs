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
