---
id: gateway-roadmap
title: Gateway roadmap
sidebar_label: Roadmap
---

# Gateway roadmap

This page records the gateway capabilities available now. Add future capabilities here after they are approved for public documentation, implemented, and verified.

## What the gateway does today

Today, AgentPaaS can:

- Run each local agent behind an isolated gateway sidecar.
- Start with default-deny egress.
- Permit only declared HTTP and HTTPS destinations.
- Block raw TCP, UDP, and ICMP through internal network isolation.
- Broker approved credentials per request without placing secret values in the agent environment.
- Apply the policy carried by a signed `.agentpaas` package.
- Record allowed and denied egress decisions in a hash-chained audit trail.
- Carry the signed package and its policy into AgentPaaS Cloud.

The current Cloud default tier enforces egress at the per-instance boundary through the control plane. Substrate-enforced network policy belongs to the paid, on-request high-assurance tier.


See [Gateway security controls](./gateway-security), [How enforcement works](../security/how-enforcement-works), and [Known limitations](../security/known-limitations).
