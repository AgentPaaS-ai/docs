---
id: known-limitations
title: Known limitations
sidebar_label: Known limitations
---

This page records accepted trade-offs and capability gaps in the current
release. A listed gap must not be mistaken for a shipped, operator-ready
feature merely because a design or specification exists.

For the full security posture, see the [threat model](./threat-model). For
authoring guidance, see [How enforcement works](./how-enforcement-works).

## Composition and workflow

Cloud workflow envelopes are the multi-step path (linear, fan-out join-all,
choice, phone-call). A single agent does not need a workflow. Native
human-in-the-loop, join-any, for-each, wait/delay, spawn deeper than one, and
standalone agent-to-agent calls are not shipped.

## Cloud data-plane assurance

AgentPaaS Cloud runs on a Cloudflare-only data plane. On the default tier,
egress and topology are enforced at the per-instance egress boundary through
the AgentPaaS control plane and gateway. The default tier does not claim
substrate-enforced isolation.

Substrate-enforced isolation (kernel-enforced network policy, independent of
our code) is reserved for the high-assurance Kubernetes tier (paid, on
demand). Cloud scope limits: HTTP/S egress only (no non-HTTP protocol
governance), and no external agent-to-agent federation.

## Long-running and routed runs

The current shipped path has one configured provider/model/credential target.
Gaps not yet closed include: immutable deployment versions and atomic
promotion/rollback; durable invocation idempotency; a single authoritative
time model; policy-derived worker CPU/process limits; first-class
conversation/session state; logical route selection across a model pool;
automatic cross-model fallback; a shared hard LLM spend limit across workflow
stages; explicit worker attempts, leases, and fencing; operator cancel and
safe-boundary pause/resume; and deterministic no-progress recovery guardrails.

Model timeout, quota, authentication, context, or subscription failures can
therefore fail the worker. These gaps close across cumulative releases; no
intermediate state should be presented as shipped long-running routed-run
support.

## Network enforcement

### HTTP proxy only (no transparent proxy for non-HTTP)

Outbound policy enforcement routes agent HTTP/HTTPS traffic through the
gateway via `HTTP_PROXY` / `HTTPS_PROXY`. Non-HTTP protocols (raw TCP, UDP,
ICMP) are blocked by internal-network isolation, not by deep packet
inspection. A transparent proxy for all protocols is deferred.

### llm_provider_lock restricts agent.llm() only

The `llm_provider_lock.allowed_endpoints` field restricts the LLM route path. It
applies only to `agent.llm()` calls. An agent can reach a non-approved LLM
provider via `agent.http(...)` if that provider's domain is in the egress
allowlist. This is defense-in-depth, not a primary control. Egress policy is
the primary restriction. To fully lock LLM calls to a provider, also remove
other LLM provider domains from the egress list.

## Supply chain and signing

### Rebuilt images differ from the publisher's

When a receiver installs a bundle without `--prefer-image`, the container
image is rebuilt locally from source and the image digest will differ from the
publisher's. The source digest, lock signature, and policy digest are verified
, but the image itself is not byte-identical. Use `--prefer-image` with a
cosign-signed image for identical reproduction.

### No revocation

There is no revocation mechanism in the current release. A stolen publisher
key can sign valid bundles until the receiver manually removes trust
(`agentpaas trust remove <fingerprint>`).

### Plugin consent gate is client-side

The Hermes plugin's consent enforcement (no auto-approve, terminal-only
install) is a client-side policy. A user could bypass it by running
`agentpaas install` directly. This is by design because the user owns their machine.
The plugin prevents LLM-mediated auto-approval, not user-mediated manual
approval.

## Audit integrity

### Hash-chain record deletion detection

Truncating the last N records from an exported JSONL audit file leaves a valid
prefix chain. Post-export tampering (deletion) cannot be detected on a second
machine without an external anchor. The audit checkpoint signing key is
encrypted at rest (AES-256-GCM), and signed checkpoint export provides tamper
evidence when anchored externally.

## Production hardening

### CAP_NET_ADMIN: capability dropped after firewall programming

The agent container's iptables egress firewall is **defense-in-depth**. The
**primary** egress control is network topology isolation (internal-only
network, no default route to the internet). After programming the firewall,
the runtime removes CAP_NET_ADMIN from the process before the worker starts.
If iptables is unavailable or a rule fails, the runtime logs a warning and
continues; topology isolation remains the hard boundary.

### Checkpoint key encrypted at rest

The ECDSA P-256 audit checkpoint signing key is stored encrypted
(AES-256-GCM, passphrase via PBKDF2-HMAC-SHA256, 100K iterations), sourced
from the macOS Keychain or a 0600 passphrase file.

## Platform support

The local runtime targets macOS with Docker Desktop or Colima. Linux-native
support is unavailable in the current release. AgentPaaS Cloud runs Linux
containers on the managed data plane.

## Additional honesty statements

- Container hardening, not a kernel 0-day sandbox.
- Outbound DLP is fingerprint-based, not semantic.
- Security testing does not replace your own review of agent code, dependencies,
  policies, and destinations.
- Local mode trusts the developer's machine. We protect against the agent,
  not against the user.

## Related

- [Threat model](./threat-model)
- [How enforcement works](./how-enforcement-works)
- [Audit export](./audit-export)
