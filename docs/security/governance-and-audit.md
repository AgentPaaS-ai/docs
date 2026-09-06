---
id: governance-and-audit
title: Governance and audit for AI agents, MCP servers, and workflows
sidebar_label: Governance and audit
description: Learn how AgentPaaS governs AI agents, MCP servers, tools, and workflows with policy decisions, run lineage, audit logs, and tamper-evident exports.
---

# Governance and audit for AI agents, MCP servers, and workflows

AgentPaaS connects workload identity, policy decisions, run records, and audit evidence. This page explains how governance works across agents, MCP servers, tools, and workflows, then links to the command procedures and verification details.

## What AgentPaaS governs

During a governed run, AgentPaaS records the workload, deployment, run, policy, and request path. The platform can record:

- Allowed and denied egress decisions.
- Declared destinations and credential bindings.
- Model and tool calls.
- Parent and child request lineage.
- Workflow stage progress and member runs.
- Signed package and deployment identity.

These records help you investigate a run and review whether it followed the declared policy. They do not prove that the workload code is safe or that a prompt injection cannot occur.

## How audit evidence is created

Every invocation creates a run. AgentPaaS connects the run to its deployment and records execution and policy events. The audit path uses hash-chained JSONL records. Signed export bundles can add checkpoint signatures.

Use [Runs and Audit Logs](../trial/runs-audit-logs) to inspect a run, read logs and events, and export records. Use [Audit export and verification](./audit-export) to verify an export on a second machine.

## Governance for MCP servers and tools

MCP servers and tools use the same deployment controls as other components. Their declared destinations, credential bindings, invocation records, and policy decisions remain part of the governed request path.

See [MCP servers](../trial/mcp-servers), [Tools](../trial/tools), and [Credentials and secrets](./credentials).

## Governance for workflows

A workflow is a signed recipe that connects deployed components. The workflow record identifies its stages and member deployments. Each invocation creates a workflow run with stage progress and member runs.

See [Workflow kinds and edges](../trial/workflow-kinds-and-edges), [Workflows](../trial/workflows), and [Known limitations](./known-limitations).

## Review workflow

1. Inspect the deployment, declared policy, destinations, and credential bindings.
2. Run the agent, MCP server, tool, or workflow.
3. Review the run status, result, logs, and events.
4. Export the audit records for the run.
5. Verify the export on a second machine.
6. Record any policy decision or unexpected request that needs follow-up.

The [security review](./security-review) page links to the threat model, enforcement details, data handling, compliance status, and current limits.

## What verification detects

Audit verification detects modified records, reordered records, and inserted records in the middle of a hash chain. In the current release, deleting the final records from an exported file can leave a valid prefix chain. External checkpoint anchoring is required to detect that tail deletion. See [Known limitations](./known-limitations).

## Related pages

- [Runs and Audit Logs](../trial/runs-audit-logs)
- [Audit export and verification](./audit-export)
- [Audit and lineage CLI reference](../cli/audit-lineage)
- [Security review](./security-review)
- [Threat model](./threat-model)
- [Architecture](../platform/architecture)
