---
id: gateway-security
title: Gateway security controls
sidebar_label: Security controls
---

# Gateway security controls

The gateway limits what an agent can do at runtime. The controls apply at the boundary where the agent requests network access, credentials, or another governed effect.

## Default-deny egress

The agent starts with no route to the internet. Add only the hosts the component needs to its declared allow list. A destination outside that list is denied and recorded.

The gateway proxies HTTP and HTTPS traffic. Raw TCP, UDP, and ICMP are blocked by internal network isolation. The gateway does not perform deep packet inspection for those protocols.

## Gateway sidecar isolation

In the local runtime, every agent run gets its own gateway sidecar. The agent container sits on an internal-only network, and the gateway is the only route to an allowed destination. A shared gateway across agents or runs is not used.

## Brokered credentials

Secret values stay outside the agent container. When an approved request needs a credential, the gateway brokers it at request time. Agent code receives neither a provider key nor a long-lived secret.

Athena uses the same model. Athena can see secret names and binding metadata required for a tenant question. She cannot read or return secret values.

## Signed policy and packages

The policy travels with the signed `.agentpaas` package. The runtime verifies the package and applies its declared authority when the component is admitted and run. Changing the allowed destinations requires changing the policy and repacking.

## Audit and lineage

The gateway records allowed and denied decisions in a hash-chained audit trail. Records connect the decision to the run, destination, credential use, and parent or child lineage when a workflow is involved. Signed checkpoints provide tamper evidence when exported and anchored externally.

## What the gateway contains

The gateway can contain a compromised or manipulated agent's network effects. It can deny an undeclared destination, keep brokered credentials out of the agent, and record the attempt for investigation.

It does not prevent prompt injection or guarantee that an allowed destination is safe. Outbound DLP is fingerprint-based, not semantic. Local mode trusts the developer's machine. The default Cloud tier does not claim substrate-enforced isolation.

See the [threat model](../security/threat-model) and [known limitations](../security/known-limitations) for the full security boundary.
