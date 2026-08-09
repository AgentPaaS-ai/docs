---
id: threat-model
title: Threat model
---

AgentPaaS contains agent blast radius with isolation, default-deny egress, brokered credentials, and tamper-evident audit.

Full narrative (marketing-styled): [agentpaas.ai/docs/threat-model](https://agentpaas.ai/docs/threat-model/) (redirects here after cutover may apply).

Canonical long form also lives in the OSS repo under `docs/` and security pages on the marketing site.

### How enforcement differs by where you run

The strength of the egress guarantee is not the same on every tier, and we would rather you read it here than assume it.

- **On your Mac (local runtime), enforcement is topological.** The agent container sits on an internal-only network behind a dedicated gateway sidecar. There is no network route out except through the gateway. That is a property of the topology, proven once by the shape of the network.
- **On AgentPaaS Cloud (default tier), enforcement is at the egress boundary.** Each run is an isolated container. Its allowed destinations are set on that instance when the run is admitted, and a gateway process outside the agent's trust boundary injects brokered credentials just before traffic leaves. Agent code never holds a credential. The platform default is fail-closed: non-HTTPS ports are denied and DNS is pinned, so if the boundary is absent the agent has no internet. This is enforced by our control plane and proven on every release by review plus adversarial testing.
- **On AgentPaaS Cloud (high-assurance tier, paid, on request), enforcement is substrate-level.** For tenants who need it, workloads run in a dedicated Kubernetes namespace with a network policy compiled from your signed policy and enforced by the kernel, independent of our code. This is the tier that answers "who enforces the enforcer" with "the cluster, verifiably."

What does not change on any tier: signed images, an SBOM, per-run identity, credentials invisible to agent code, default-deny egress, and a hash-chained audit log. Only the mechanism's assurance class changes.

### What we do not claim

- Not a kernel 0-day sandbox
- Outbound DLP is fingerprint-based, not semantic
- Local mode trusts your machine
- Cloud trial secrets use the managed vault for the trial tier
- On the cloud default tier we do not claim substrate-enforced isolation; that claim belongs to the high-assurance tier
- Cloud egress is HTTPS only; no non-HTTP protocol governance, and no external agent-to-agent federation

See also [How enforcement works](./how-enforcement-works).
