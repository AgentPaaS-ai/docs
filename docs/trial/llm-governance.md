---
id: llm-governance
title: LLM governance
sidebar_label: LLM governance
---

# LLM governance

Use the signed policy to control LLM credentials, token budgets, PII handling, model routing, and recorded usage. Pack the policy before deployment so the runtime and the Cloud console use the same contract.

## LLM budgets

Add `llm_budget` to `policy.yaml` when a run needs token or spend ceilings:

```yaml
llm_budget:
  max_tokens: 100000
  max_tokens_per_request: 8000
  max_cost_usd: "10.00"
```

`max_tokens` limits total token use for an invoke. `max_tokens_per_request` limits one LLM request. `max_cost_usd` limits recorded model spend. A budget exhaustion fails the run. A policy without these fields leaves this policy budget disabled.

## PII controls

The mapping form is `guardrails.pii`:

```yaml
guardrails:
  pii:
    action: mask
    builtins:
      - Email
      - Ssn
      - DriversLicense
      - CreditCard
      - Key
    patterns:
      - "\\b(?:\\+1[-. ]?)?\\(?[2-9][0-9]{2}\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}\\b"
```

The built-in detector names are exact and case-sensitive. Phone numbers use a custom pattern in this release. There is no `Phone` built-in.

Use `mask` to replace a detected value with `[REDACTED]`. Use `reject` to block the request. Masking occurs before the event is written to audit. When inspection is required for a stream, the runtime buffers the stream or fails closed. Detector, audit, and budget failures do not turn the policy into an allow path.

A reject policy must define the reject response fields accepted by the policy validator. Run `agentpaas policy validate` before packing.

## Virtual model aliases

Cloud can resolve a logical model alias to a configured provider model. Availability-only failures can move one LLM call to its configured fallback. The eligible failures are HTTP `429`, HTTP `5xx`, timeout, and connection failure.

A content refusal does not trigger failover. Failover is per LLM call and does not consume a workflow stage retry.

## OAuth LLM credentials

`oauth_llm` stores a refresh-token reference and uses the gateway to obtain an access token. Access tokens stay in memory. Refresh tokens remain in the vault. The token endpoint must be public HTTPS.

The policy validator requires these fields for an `oauth_llm` credential:

```yaml
credentials:
  - id: nous-llm
    type: oauth_llm
    token_endpoint: https://example.invalid/oauth/token
    client_id: example-client-id
    refresh_token_credential: oauth_llm_rt_nous
```

Store the refresh token under the declared secret name with the required `oauth_llm_rt_` prefix. The workload receives the governed LLM path, not the refresh token or access token.

TODO: verify the production Nous Research OAuth token endpoint, client ID registration procedure, required scopes, and model host before publishing a copy-paste Nous configuration. Nous's public inference documentation currently documents API-key authentication, while the AgentPaaS product path requires an OAuth token exchange. Do not replace the example above with an unverified endpoint.

## Automatic credential compilation

When `agent.yaml` names an LLM credential, `agentpaas pack` carries the credential reference into the compiled signed policy. The secret value is not copied into the bundle or container.

Inspect the compiled contract before deployment:

```bash
agentpaas policy show
agentpaas policy validate
```

The output contains credential IDs, never credential values.
