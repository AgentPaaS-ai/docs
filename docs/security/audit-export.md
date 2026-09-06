---
id: audit-export
title: Audit export and verification
sidebar_label: Audit export
---

AgentPaaS maintains a tamper-evident audit trail for every governed action.
This page covers exporting audit records and verifying integrity on a second
machine. This is the workflow a security reviewer uses to trust run evidence.

See [How enforcement works](./how-enforcement-works) for what gets audited and
the [threat model](./threat-model) for tamper controls. For the CLI command
surface, see [Runs and Logs](/cli/audit-lineage).

## Overview

The runtime appends events to a hash-chained JSONL log. Each record links to
its predecessor via SHA-256 hashes over canonical JSON. You can export a run's
audit trail and verify the chain independently of the originating machine.

Logs are the signed, hash-chained evidence of execution and policy decisions.
They are not stdout.

## Export a run's audit trail

List recent audit entries to find the run ID, then export records for a
specific run:

```bash
agentpaas audit query
agentpaas audit query --run-id <run-id>
agentpaas audit export --output audit.jsonl
```

The export writes one JSON object per line (JSONL). Each record includes:

| Field | Description |
|---|---|
| `seq` | Monotonically increasing sequence number (1-based). |
| `prev_hash` | SHA-256 hex of the previous record's canonical JSON. |
| `record_hash` | SHA-256 hex of this record's canonical JSON. |
| `timestamp` | RFC 3339 event timestamp. |
| `event_type` | Event kind (e.g. egress decision, run lifecycle). |
| `actor` | Identity that triggered the event. |
| `payload` | Structured event data. |

Transfer `audit.jsonl` to the reviewer's machine by any secure channel.

## Verify the hash chain

On the second machine (with `agentpaas` installed):

```bash
agentpaas audit verify --file audit.jsonl
```

A successful verification confirms:

- The genesis record (seq=1) has an empty `prev_hash`.
- Each subsequent record's `prev_hash` matches the previous record's
  `record_hash`.
- Each `record_hash` recomputes correctly from the record's canonical JSON
  (sorted map keys, `record_hash` field excluded from the hash input).

## What verification detects

| Tamper type | Detected? |
|---|---|
| Modified record content | Yes, `record_hash` mismatch |
| Reordered records | Yes, `prev_hash` chain break |
| Inserted middle record | Yes, chain break at insertion point |
| Truncated tail records | **No** in the current release, see limitation below |

## Signed export bundles

Full exports may include a signed manifest and checkpoint signatures bound to
the audit key fingerprint shown by `agentpaas doctor`. Bundle verification
checks checkpoint signatures in addition to the hash chain.

## Limitation: tail truncation

If an attacker removes the last N records from an exported JSONL file, the
remaining prefix chain is still valid. Detecting that deletion requires signed
checkpoint anchors. The audit checkpoint signing key is stored encrypted
(AES-256-GCM). External anchoring is required to detect deletion of the final
records after export. See
[Known limitations](./known-limitations).

## Typical review workflow

1. Operator completes a governed run and exports `audit.jsonl`.
2. Operator shares the file plus the `agentpaas doctor` key fingerprint.
3. Reviewer runs `agentpaas audit verify --file audit.jsonl` on a clean
   machine.
4. Reviewer inspects `egress_denied`, `egress_allowed`, and credential events
   in the payload fields to confirm policy compliance.

## Related

- [How enforcement works](./how-enforcement-works)
- [Threat model](./threat-model)
- [Known limitations](./known-limitations)
