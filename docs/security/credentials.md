---
id: credentials
title: Credentials and secrets
sidebar_label: Credentials and secrets
---

AgentPaaS uses a **brokered credential model**. Raw secrets never reach the
agent container. The gateway mediates all credential access on the agent's
behalf.

This page is the customer-facing statement of where secrets live and who can
see them. For the CLI commands, see
[Secrets and bindings](/cli/secrets).

## Architecture

- **Gateway injection.** Credentials are injected into the gateway, not the
  agent container. When an agent makes an API call that requires
  authentication, the gateway attaches the appropriate credential to the
  outbound request.
- **Secret storage.** On the local runtime, credentials are stored in the
  macOS Keychain via the `security` framework. The daemon reads them at
  startup and passes them to the gateway over a local Unix socket. On
  AgentPaaS Cloud, trial-tier secrets use the managed vault.
- **No env passthrough.** Raw secrets never appear in container environment
  variables or the container filesystem. The agent code has no path to
  accidentally log, echo, or exfiltrate a secret.

## Policy controls

The policy file (`policy.yaml`) declares which credentials an agent run may
access. The gateway enforces this: if a credential is not listed in the policy
for that run, the gateway refuses to attach it to any outbound request. This
This gives you fine-grained control. One agent gets the weather API key, not your
source-control token.

## Audit trail

Every credential access is recorded in the signed audit chain:

- Which credential was used (by label, never by value)
- Which outbound request it was attached to
- Whether the policy allowed or denied the access
- Timestamp and run identifier

This gives you a complete, verifiable log of how your secrets were used during
each agent run. See [Audit export](./audit-export) for how to export and
verify that chain.

## Related

- [Threat model](./threat-model)
- [How enforcement works](./how-enforcement-works)
- [Audit export](./audit-export)
