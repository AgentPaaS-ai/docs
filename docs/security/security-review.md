---
id: security-review
title: Security review
sidebar_label: Security review
---

Use this page as the starting point for a security review of AgentPaaS. It links to the current control descriptions, evidence paths, and stated limits without replacing your review of agent code, dependencies, policies, destinations, or provider terms.

## Security posture

- [Threat model](./threat-model) explains the boundaries, enforcement tiers, and claims AgentPaaS does not make.
- [How enforcement works](./how-enforcement-works) shows how signed bundles, default-deny egress, gateway enforcement, brokered credentials, and audit records fit together.
- [Architecture](../platform/architecture) describes what runs locally and in Cloud, request flow, authority boundaries, and responsibility boundaries.

## Credentials and data

- [Credentials and secrets](./credentials) describes storage, gateway brokering, policy bindings, and credential audit records.
- [Data handling and LLM providers](./data-handling) explains where prompts and tool data can go, US Cloud residency, and which provider settings remain your responsibility.

## Evidence and attestations

- [Audit export and verification](./audit-export) covers signed, hash-chained JSONL exports and what verification can detect. Tail deletion remains a documented limitation.
- [Compliance and attestations](./compliance) states the current SOC 2 status, sole infrastructure subprocessor, US data residency, and penetration-testing status.

## Read the limits

- [Known limitations](./known-limitations) records unsupported workflow paths, HTTP/HTTPS scope, default-tier assurance, local-mode trust, signing gaps, and audit limits.

The Cloud default tier does not claim substrate-enforced isolation. The paid, on-request high-assurance tier provides that additional substrate boundary. AgentPaaS does not claim prompt-injection prevention or SOC 2 certification.
