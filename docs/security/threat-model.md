---
id: threat-model
title: Threat model
---

AgentPaaS contains agent blast radius with isolation, default-deny egress, brokered credentials, and tamper-evident audit.

Full narrative (marketing-styled): [agentpaas.ai/docs/threat-model](https://agentpaas.ai/docs/threat-model/) (redirects here after cutover may apply).

Canonical long form also lives in the OSS repo under `docs/` and security pages on the marketing site.

### What we do not claim

- Not a kernel 0-day sandbox
- Outbound DLP is fingerprint-based, not semantic
- Local mode trusts your machine
- Preview vault is not isolation-grade multi-tenant HSM

See also [How enforcement works](./how-enforcement-works).
