---
sidebar_label: Sharing Agents
title: Sharing Agents
id: sharing-agents
slug: /trial/sharing-agents
---

Share an agent without sharing your keys. You hand someone a signed `.agentpaas` bundle, and they inspect its policy and provenance before they run it.

A signed bundle tells the receiver who signed it and whether the signed data changed. It does not tell them that the agent is safe. The receiver still reviews the code, policy hosts, credentials, and provenance.

## Prerequisites

- macOS with AgentPaaS CLI 0.4.1 or newer
- A working agent project, such as `weather-bot`
- A publisher identity
- A separate channel for the publisher fingerprint, such as a phone call or Signal

## Sender: export an agent

Use the sender machine to create the bundle. Keep your local credentials on this machine.

### 1. Show your publisher identity

If you already created the identity for the weather demo, display it before you share the bundle:

```bash
agentpaas identity show
```

Record the full 64-character hexadecimal fingerprint. You will give it to the receiver through a separate channel from the bundle.

For the identity command reference, see [Identity and trust](/cli/identity-trust).

### 2. Export the project

Run the export from the project directory. This example writes `weather-bot.agentpaas` in the current directory:

```bash
agentpaas export ./weather-bot --output weather-bot.agentpaas --yes
```

The default export does not include a prebuilt image. The receiver rebuilds the image locally from the bundle contents.

### 3. Inspect the bundle

Run the offline inspection before sending the file:

```bash
agentpaas bundle inspect weather-bot.agentpaas
```

The inspection reports 9 checks. Review the publisher fingerprint, policy hosts, credentials, provenance, digests, and the image status. For the weather agent, the policy hosts include `wttr.in` and the LLM host used by the agent.

### 4. Show provenance

Check the signed lineage for the agent name:

```bash
agentpaas provenance show weather-bot
```

### 5. Send the bundle and fingerprint separately

Send the `.agentpaas` file through your normal file-sharing channel. Send the full 64-character fingerprint through a separate channel, such as a phone call or Signal.

Tell the receiver to compare the fingerprint from your message with the fingerprint reported by `agentpaas bundle inspect`. A matching signature identifies the signer and shows that the signed data is unmodified. It does not establish that the agent is safe.

## Receiver: inspect, install, and run

Review the bundle before you install it. The receiver owns the policy decision and supplies the local credentials.

### 1. Inspect the received bundle

Save the file, then inspect it locally:

```bash
agentpaas bundle inspect weather-bot.agentpaas
```

Confirm that the inspection reports 9 checks and that the displayed publisher fingerprint matches the full 64-character fingerprint you received separately. Read the policy hosts and declared credentials. For the weather agent, check that the hosts match the destinations you expect, including `wttr.in` and the LLM host.

If the fingerprint does not match, stop. Ask the sender for a fresh bundle and fingerprint pair through verified channels.

### 2. Install with explicit consent values

Use the full publisher fingerprint and the policy digest from the bundle's `agent.lock`:

```bash
agentpaas install weather-bot.agentpaas --yes --confirm-fingerprint <full-64-hex> --accept-policy <64-hex-policy-digest> --allow-unlocked-deps
```

Replace `<full-64-hex>` with the complete 64-character publisher fingerprint. Replace `<64-hex-policy-digest>` with the 64-character `policy_digest` value from `agent.lock`.

Do not prefix the policy digest with `sha256:`. That fails with:

```text
does not match the bundle policy digest
```

`agentpaas bundle inspect --json` does not expose `.policy_digest`. Do not use `jq .policy_digest` to obtain this value.

For the general install reference, see [Install](/cli/install).

### 3. Find the installed reference

List the installed agents:

```bash
agentpaas installed list
```

Use the installed reference in the form `name@pub8`, for example:

```text
weather-bot@pub8
```

The `pub8` suffix identifies the first 8 characters of the publisher fingerprint in the installed reference. Use the exact reference printed on your machine.

### 4. Map your local credentials

Map each declared credential to a secret name on the receiver machine. This example maps the declared `openrouter-key` credential to the receiver's local secret with the same name:

```bash
agentpaas installed map-credential weather-bot@pub8 openrouter-key=openrouter-key
```

The receiver supplies the local secret. The bundle does not transfer your secret, and the sender's secret never belongs in the shared file.

### 5. Invoke the installed agent

Invoke the agent with a JSON payload and wait for the result:

```bash
agentpaas trigger invoke weather-bot@pub8 --payload '{"city":"Folsom"}' --wait
```

Use the input shape required by the agent you received. The weather example accepts a `city` field.

### 6. Review your local audit records

Review the run and audit records on the receiver machine using your local AgentPaaS audit tools and retention process. The receiver owns those records and their external anchoring. A sender's bundle does not give the sender access to the receiver's local audit history.

See [Governance and audit](/security/governance-and-audit) and [Audit export](/security/audit-export) for the audit model and export path.

## Fork an installed agent

A receiver can create a new project from an installed reference, edit it, and publish it as a new publisher. The provenance chain records the additional hop.

### 1. Fork the installed reference

```bash
agentpaas fork weather-bot@pub8 ./weather-bot-fork
```

Replace `weather-bot@pub8` with the exact reference from `agentpaas installed list`.

### 2. Pack the fork

Edit the project as needed, then pack it:

```bash
agentpaas pack ./weather-bot-fork
```

### 3. Export the fork as a new bundle

```bash
agentpaas export ./weather-bot-fork --output weather-bot-fork.agentpaas --yes
```

The new bundle is signed by the publisher identity on the fork machine. Its provenance shows the additional hop, so a receiver can inspect how the bundle reached its final signer.

## What the checks mean

- A signature identifies the key that signed the bundle and shows that the signed data is unmodified.
- The policy summary lists the hosts the agent can call and the credentials it declares.
- The SBOM is included in the bundle for dependency review.
- The receiver's audit records are created and retained on the receiver machine. The receiver decides how to review and anchor them.

For the limits of signatures, rebuilt images, local enforcement, and audit records, read [Trust model](/security/trust-model) and [Known limitations](/security/known-limitations).
