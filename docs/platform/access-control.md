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

## What does not change

Regardless of tenant access, the runtime controls remain brokered credentials, default-deny egress, signed artifacts, and the tamper-evident audit chain. See [How enforcement works](/security/how-enforcement-works).

## Related

- [Trust model](/security/trust-model), publisher identity and signing
- [Credentials and secrets](/security/credentials)
- [Audit export](/security/audit-export)
