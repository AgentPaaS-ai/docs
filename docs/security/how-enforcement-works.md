---
id: how-enforcement-works
title: How enforcement works
sidebar_label: How enforcement works
---

# Policy, enforced by default

AgentPaaS does not ask the model to "please behave." It places the agent where policy is enforced before any bytes leave. The same sealed bundle you build on a laptop runs under that model locally and on AgentPaaS Cloud. What changes between the two is how the enforcement is anchored, and we spell that out below rather than leave it to assumption.

```text
 LOCAL                                          CLOUD
 +---------------------------+                  +------------------------------------------+
 |  $ agentpaas pack         |                  |              AGENTPAAS CLOUD             |
 |  agent + policy + sign    |   signed bundle  |                                          |
 |                   	     +----------------->|  +----------------+   +---------------+  |
 +---------------------------+                  |  |    AGENT       |   |  control      |  |
                                                |  |   CONTAINER    |   |  plane        |  |
 Same bundle.                                   |  +-------+--------+   +-------+-------+  |
 Same guarantees.                               |          |                   | audit     |
 Any substrate.                                 |          | per-instance      | chain     |
                                                |          | egress policy     |           |
                                                |          v                   |           |
                                                |  +----------------+          |           |
                                                |  |    GATEWAY     |--brokered-+          |
                                                |  | default-deny   | credentials          |
                                                |  +-------+--------+                      |
                                                +----------|-------------------------------+
                                                           v
                                                 declared allow-listed destinations only
```

Build and sign locally. Deploy the same sealed bundle to cloud. Isolation, default-deny egress, brokered credentials, and tamper-evident audit. Same guarantees on any substrate.

## What the diagram is saying

On the left, you pack an agent with its **policy** into a signed `.agentpaas` bundle. That package is what moves. You are not shipping "trust me" source that behaves differently in production; you ship a sealed artifact the runtime can verify.

On the right, the agent runs in an isolated **container**. Its allowed destinations are set on that specific instance when the run is admitted, and a **gateway** outside the agent's trust boundary injects **brokered credentials** just before traffic leaves. Agent code never holds a long-lived secret. The control plane keeps a **hash-chained** record of what was allowed, denied, and invoked. The platform default is fail-closed, so if the gateway path is absent the agent has no internet.

## The honest part: enforcement is anchored differently per tier

Widening what an agent can touch always means changing the declared allow list and repacking, not hoping a prompt holds. That is true on every tier. What differs is the strength of the guarantee underneath.

- **Locally, enforcement is topological.** The agent container sits on an internal-only network behind a dedicated gateway sidecar, so there is no route out except through the gateway. That holds because of the network's shape.
- **On cloud's default tier, enforcement is at the egress boundary.** The per-instance egress policy and the gateway do the same job, but they are enforced by our control plane and proven on every release by review plus adversarial testing, rather than by the network shape.
- **On the high-assurance tier (paid, on request), enforcement is substrate-level.** Workloads run in a dedicated Kubernetes namespace with a network policy compiled from your signed policy and enforced by the kernel, independent of our code.

We do not claim substrate-enforced isolation on the default tier. That claim belongs to the high-assurance tier, and the [threat model](./threat-model) says so plainly.

## Controls in one table

| Control | What it stops |
|---------|----------------|
| Default-deny egress | Any host you did not put on the allow list |
| Credential brokering | Secrets never enter agent code; the gateway injects per request |
| Container isolation | Non-root, read-only rootfs, no shell, stripped capabilities, seccomp |
| Tamper-evident audit | Hash-chained log + signed checkpoints; edits fail verify |
| Signed bundles | Portable `.agentpaas` packages with publisher identity and provenance |

See also the [threat model](./threat-model), [CLI audit and lineage](/cli/audit-lineage), and the live product page on [agentpaas.ai](https://agentpaas.ai/#enforcement).
