---
id: audit-lineage
title: Audit and lineage
sidebar_label: Audit and lineage
---

## audit (local)

```bash
agentpaas audit
agentpaas audit export
```

Inspect harness events for runs under `~/.agentpaas/state/runs/`.

Useful event types:

| Event | Meaning |
|-------|---------|
| `egress_allowed` | Gateway allowed a host on policy |
| `egress_denied` | Gateway blocked a host |
| run lifecycle | start / end / failure |

Example denial shape:

```json
{
  "event_type": "egress_denied",
  "actor": "gateway",
  "payload": {
    "domain": "evil.example.com",
    "reason": "policy_denied"
  }
}
```

## provenance

```bash
agentpaas provenance <ref>
```

Signed build / publisher chain for the artifact.

## Cloud

```bash
agentpaas cloud audit
agentpaas cloud audit export <run-id>
agentpaas cloud events <run-id>
agentpaas cloud metrics
```
