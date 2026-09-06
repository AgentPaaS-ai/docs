---
id: data-handling
title: Data handling and LLM providers
sidebar_label: Data handling
---

This page describes what data an agent can touch, where that data can go, and
how prompt data is handled by the large-language-model providers your agents
call.

## The boundary

An agent's outbound traffic is governed by a declared, default-deny egress
policy. Prompt and tool data transits **only** the hosts you put on the allow
list. The credential used to reach a model provider is brokered by the gateway
and never enters agent code. This is the same governed egress boundary as any
other host the agent calls. See [How enforcement works](./how-enforcement-works).

## Which providers your prompts go to

The model provider, model, and credential binding are configured per agent.
Prompts are sent to the provider endpoint you configure. Nothing is fanned
out to providers you did not declare. To restrict an agent to a single
provider, keep only that provider's host on the egress allow list.

## Who controls whether your data trains a model

**Training-use of your prompt data is a setting at your inference provider,
not something AgentPaaS can enforce for you.**

If you route through OpenRouter (or another inference layer or model
provider), configure that provider's data controls to opt out of training on
your data. AgentPaaS controls where your data is allowed to go; it cannot set
the retention or training policy inside the provider's systems.

If you want AgentPaaS to help ensure your inference layer is configured not to
train on your data, contact support and we will help you set it up.

## What AgentPaaS does and does not claim

- **Does:** route prompt/tool data only to declared hosts, broker the
  credential, and record the access in the signed audit chain.
- **Does not:** set or guarantee the training/retention policy of an external
  model provider. That is a customer-controlled setting at the provider.

## Retention

AgentPaaS is a platform service. We **do not retain or use customer data for
any training purpose**, and we store only what is needed to operate the
platform as a service. Stored data includes run metadata, the signed audit chain, and the brokered
secrets you push. We do not use your prompts, files, or run content to train
any model.

This is separate from the model provider's own data policy, covered above:
what an external provider does with prompt data is governed by your agreement
and settings with that provider, not by AgentPaaS.

## Related

- [Credentials and secrets](./credentials)
- [Threat model](./threat-model)
- [Compliance](./compliance)
