---
id: audit-lineage
title: Runs and Logs
sidebar_label: Runs and Logs
---

A run is one execution. The console lists it under Runs. The signed,
hash-chained evidence of execution and policy decisions is under Logs.
Documentation calls the four-control mechanism Audit. Logs are not stdout.

Use the run identifier shown after invoke to inspect the result and logs.

## Export and verify

You can export a run's audit trail and verify its hash chain on a second
machine. This is the workflow a security reviewer uses to trust run evidence.

```bash
agentpaas audit query
agentpaas audit query --run-id <run-id>
agentpaas audit export --output audit.jsonl
agentpaas audit verify --file audit.jsonl
```

See [Audit export and verification](/security/audit-export) for the record
format, what verification detects, and the tail-truncation limitation.

## Related

- [Audit export and verification](/security/audit-export)
- [How enforcement works](/security/how-enforcement-works)
