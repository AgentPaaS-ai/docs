---
id: compliance
title: Compliance and attestations
sidebar_label: Compliance
---

Last reviewed: 2026-09-06

This page states where AgentPaaS stands on third-party compliance
attestations, subprocessors, data residency, and penetration testing. We would
rather you read an accurate answer here than assume one.

## SOC 2

AgentPaaS is **working toward SOC 2 and is not yet certified**. We do not
claim SOC 2, ISO 42001, NIST-compliant, or CSA STAR attainment, and we do not
display certification logos we have not earned. When an attestation is
achieved, this page will name it and link the report scope.

The controls that a SOC 2 audit evaluates are documented throughout this site
, brokered credentials, default-deny egress, container isolation, signed
artifacts, and the tamper-evident audit chain. See
[How enforcement works](./how-enforcement-works) and the
[threat model](./threat-model) for the mechanism-level detail an auditor or
your security team can review today.

## Subprocessors

AgentPaaS Cloud runs on Cloudflare's data plane. **Cloudflare is our sole
infrastructure subprocessor**. It hosts the compute, storage, and network
that run the platform. We do not use additional third-party subprocessors to
deliver the service.

The model providers your agents call (for example OpenRouter, or another
inference provider you configure) are **your** vendors, not ours: you supply
the credential and the provider relationship. See
[Data handling](./data-handling) for how prompt data reaches them.

## Data residency

AgentPaaS Cloud data is processed and stored in the **United States**.

## Penetration testing

We do not currently have an independent penetration-test report to share. The
security pages describe the controls and limitations that customers can review
today. Contact us if your review requires additional security materials.

## What you can verify without an attestation

An attestation is evidence about us. The product also gives you evidence you
can check directly, today:

- **Audit chain.** Export a run's signed, hash-chained audit trail and verify
  it on a second machine. See [Audit export](./audit-export).
- **Signed artifacts.** Verify that the artifact running in production is the
  one you approved, with signed provenance. See [Trust model](./trust-model).
- **Egress policy.** Read the declared allow list and confirm the agent can
  reach nothing beyond it. See [Credentials and secrets](./credentials).

## Related

- [Threat model](./threat-model)
- [Known limitations](./known-limitations)
- [How enforcement works](./how-enforcement-works)
