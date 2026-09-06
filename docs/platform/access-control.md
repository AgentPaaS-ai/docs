---
id: access-control
title: Access control
sidebar_label: Access control
---

This page describes who can access an AgentPaaS tenant, what they can do, and
where that is heading.

There are two distinct identity questions, and they are answered by different
mechanisms:

- **Who can build and sign an agent:** publisher identity and trust. See the
  [trust model](/security/trust-model).
- **Who can access a tenant** to deploy, invoke, and read audit: tenant
  access control. That is this page.

## Current state

In the current trial, each tenant has a **single admin login**. Whoever holds
that login can deploy components, invoke deployments, manage secrets and
bindings, and read the audit trail for that tenant.

There is no per-user role separation within a tenant today. Do not grant the
trial login more broadly than you intend that one identity to reach.

## Roadmap: RBAC for your team

Role-based access control for multiple employee accounts is **coming**. It is
not available in the current release, and we do not claim it is.

The goal is to let every one of your employees create and run workflows, as
permitted by your IT, with roles that separate who can author, who can
deploy, who can invoke, and who can read audit evidence. When RBAC ships,
this page will describe the roles and how to assign them.

## What does not change

Regardless of how tenant access evolves, the runtime guarantees stay the same:
brokered credentials, default-deny egress, signed artifacts, and the
tamper-evident audit chain apply to every run, whoever started it. See
[How enforcement works](/security/how-enforcement-works).

## Related

- [Trust model](/security/trust-model), publisher identity and signing
- [Credentials and secrets](/security/credentials)
- [Audit export](/security/audit-export)
