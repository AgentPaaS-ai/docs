---
id: faq
title: Frequently asked questions
sidebar_label: FAQ
---

# Frequently asked questions

Short answers to the questions that come up in architecture, security, and
procurement reviews. Each answer links to the page with the implementation
details and limits.

## What is AgentPaaS?

AgentPaaS packages, runs, and audits agents, applications, MCP servers, tools,
and agentic workflows. Its core controls are isolated containers, default-deny
egress, gateway-brokered credentials, and a tamper-evident audit trail. See
[What is AgentPaaS?](./trial/what-is-agentpaas) and the [architecture](./platform/architecture).

## Which workloads are supported?

You can run a single agent, application, MCP server, or tool, or compose a
multi-step workflow from deployed components. A single component does not need
a workflow. See [What is AgentPaaS?](./trial/what-is-agentpaas) and [workflow
kinds and edges](./trial/workflow-kinds-and-edges).

## What is the difference between local runtime and AgentPaaS Cloud?

The same signed package can run in both places. Local execution uses an
isolated container behind a gateway sidecar and trusts the developer's
machine. Cloud runs the workload on AgentPaaS's managed Cloudflare data plane;
the enforcement mechanism depends on the Cloud tier. See [Architecture](./platform/architecture)
and the [threat model](./security/threat-model).

## Does an agent have direct internet access?

No. Outbound traffic goes through the gateway to declared HTTP or HTTPS
destinations. If the gateway path is absent, the default-deny model leaves the
agent without internet access. Raw TCP, UDP, and ICMP are outside the current
transparent proxy model. See [How enforcement works](./security/how-enforcement-works)
and [Known limitations](./security/known-limitations).

## How are credentials handled?

Raw provider credentials do not enter agent code, the container environment, or
the container filesystem. The gateway brokers an approved credential at
request time and records its use by label. Local credentials use the macOS
Keychain; Cloud trial-tier secrets use the managed vault. See [Credentials and
secrets](./security/credentials).

## Is egress default-deny?

Yes. A signed policy declares the allowed destinations, and an undeclared
destination is denied. The default Cloud tier enforces this at the per-instance
egress boundary through the control plane and gateway. See [How enforcement
works](./security/how-enforcement-works) and the [threat model](./security/threat-model).

## What does package signing prove?

A signed `.agentpaas` package establishes publisher identity, package
integrity, and provenance checks. It does not prove that the component is safe,
that its dependencies are safe, or that its policy is appropriate. Review the
source, dependencies, destinations, bindings, and permissions. See [Architecture](./platform/architecture)
and [Known limitations](./security/known-limitations).

## Does AgentPaaS prevent prompt injection?

No. Prompt injection remains a threat. AgentPaaS contains the consequences of
an agent's actions with policy, egress, credential, isolation, and audit
controls; it does not make agent code or prompts safe and does not replace
application authorization or customer review. See [What is AgentPaaS?](./trial/what-is-agentpaas)
and the [threat model](./security/threat-model).

## How is Cloud enforcement tiered?

The default Cloud tier enforces policy at the per-instance egress boundary
through the control plane and gateway. It does not claim substrate-enforced
isolation. The paid, on-request high-assurance tier adds a dedicated
Kubernetes namespace with a kernel-enforced network policy compiled from the
signed policy. See [How enforcement works](./security/how-enforcement-works).

## Where is Cloud data stored?

AgentPaaS Cloud currently processes and stores customer data in the United
States only. Other residency requirements need a separate availability
discussion. See [Compliance and attestations](./security/compliance) and [Data
handling](./security/data-handling).

## How does AgentPaaS handle model-provider data?

Prompts go only to the model provider and endpoint configured for the agent,
through the declared egress path. AgentPaaS does not use customer prompts,
files, or run content to train a model. The provider's retention and training
settings remain the customer's responsibility and are not enforced by
AgentPaaS. See [Data handling and LLM providers](./security/data-handling).

## Who are the Cloud subprocessors?

Cloudflare is AgentPaaS's sole infrastructure subprocessor for the service.
Model providers that you configure and pay for are your vendors, not AgentPaaS
subprocessors. See [Compliance and attestations](./security/compliance).

## Is AgentPaaS SOC 2 certified?

No. AgentPaaS is working toward SOC 2 and is not yet certified. It does not
claim SOC 2, ISO 42001, NIST-compliant, or CSA STAR attainment. See [Compliance
and attestations](./security/compliance).

## Which workflow types are supported?

The current Cloud workflow envelope supports **Linear**, **Fan-out**,
**Choice**, and **Phone call**. It does not currently ship native
human-in-the-loop, join-any, for-each, wait or delay, deeper-than-one spawn,
or standalone agent-to-agent calls. See [Workflow kinds and edges](./trial/workflow-kinds-and-edges)
and [Known limitations](./security/known-limitations).

## What are the current limitations?

The current release supports HTTP/S egress only, has no external
agent-to-agent federation or signing revocation, and does not provide
substrate-enforced isolation on the default Cloud tier. Local mode trusts the
host machine. Long-running routed-run features, including durable
idempotency, pause/resume, cross-model fallback, and shared hard spend limits,
are not fully shipped. See [Known limitations](./security/known-limitations).

## What can customers verify themselves?

Customers can inspect the signed package and its declared policy, review the
destination and credential bindings, and export the signed, hash-chained audit
trail. Run `agentpaas audit verify --file audit.jsonl` on a second machine to
check modified, reordered, or inserted records. Verification does not detect
truncation of the final records without an external checkpoint anchor. See
[Audit export](./security/audit-export), [Compliance and attestations](./security/compliance),
and [Known limitations](./security/known-limitations).
