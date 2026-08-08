---
id: how-enforcement-works
title: How enforcement works
---

Every run gets a dedicated gateway path. Credentials are brokered; the agent does not hold long-lived provider keys in its environment by default. Egress is default-deny and policy-allowlisted. Audit is hash-chained.

For the full product page see the marketing site security docs and OSS `docs/how-enforcement-works.md`.

Open the [cloud console](https://cloud.agentpaas.ai) to inspect runs and audit after an invoke.
