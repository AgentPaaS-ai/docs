---
id: how-enforcement-works
title: How enforcement works
sidebar_label: How enforcement works
---

# Policy is topology

AgentPaaS does not ask the model to “please behave.” It places the agent where the network path itself enforces policy. The same sealed bundle you build on a laptop runs under that model locally and on AgentPaaS Cloud.

```text
 LOCAL                                          CLOUD
 +---------------------------+                  +------------------------------------------+
 |  $ agentpaas pack         |                  |              AGENTPAAS CLOUD             |
 |  agent + policy + sign    |   signed bundle  |                                          |
 |  .agentpaas  -------------+----------------->|  +----------------+   +---------------+  |
 +---------------------------+                  |  | agent container|   |    daemon     |  |
                                                |  | non-root, ro fs|   | policy/runner |  |
 same security model on                         |  | no shell/seccomp|  | + auditor    |  |
 laptop and in cloud                            |  +-------+--------+   +-------+-------+  |
                                                |          |  internal-only net  |         |
                                                |          v                     | audit   |
                                                |  +----------------+            | chain   |
                                                |  |    GATEWAY     |--brokered--+         |
                                                |  | only route out | credentials          |
                                                |  | default-deny   | per request          |
                                                |  +-------+--------+                      |
                                                +----------|-------------------------------+
                                                           v
                                              declared allow-listed destinations only
```

Build and sign locally. Deploy the same sealed bundle to cloud. Isolation, default-deny egress, brokered credentials, and tamper-evident audit. Unchanged either way.

## What the diagram is saying

On the left, you pack an agent with its **policy** into a signed `.agentpaas` bundle. That package is what moves. You are not shipping “trust me” source that behaves differently in production; you ship a sealed artifact the runtime can verify.

On the right, the agent container sits on an **internal-only network**. It is non-root, read-only where it matters, without a shell, under seccomp. It has no open path to the public internet. The **only** way out is the dual-homed **gateway**: default-deny, allow-listed destinations only. Secrets never live in the agent environment as long-lived keys; the gateway **brokers credentials per request**. Meanwhile the daemon and auditor keep a **hash-chained** record of what was allowed, denied, and invoked.

That is why we say policy is topology. Widening what an agent can touch means changing the declared allow list and repacking, not hoping a prompt holds. The same topology story applies on your Mac and in the cloud console after deploy.

## Controls in one table

| Control | What it stops |
|---------|----------------|
| Default-deny egress | Any host you did not put on the allow list |
| Credential brokering | Secrets never enter agent code; the gateway injects per request |
| Container isolation | Non-root, read-only rootfs, no shell, stripped capabilities, seccomp |
| Tamper-evident audit | Hash-chained log + signed checkpoints; edits fail verify |
| Signed bundles | Portable `.agentpaas` packages with publisher identity and provenance |

See also the [threat model](./threat-model), [CLI audit and lineage](/cli/audit-lineage), and the live product page on [agentpaas.ai](https://agentpaas.ai/#enforcement).
