---
sidebar_label: Sharing Agents
title: Sharing Agents
id: sharing-agents
slug: /trial/sharing-agents
---

Use this page from Hermes or another AI coding harness when you need to share a working AgentPaaS package. Pack and send the signed file, then give the receiver a separate fingerprint. On receipt, inspect the package, compare identity, review policy, install with explicit consent, map local secrets, and run it under the receiver's audit process.

The same trust concept applies to agents, apps, MCP servers, tools, and workflows. If a type has its own pack or export command, use that type's pack command, then follow the same inspect, install, and fingerprint steps.

## Who this is for

This page is for Hermes and other AI coding harnesses operating an AgentPaaS project. After a component works locally, share its signed package. When you receive a package, confirm its identity, integrity, and policy before you run it.

## Prerequisites

- AgentPaaS CLI 0.4.1 or newer
- A working project directory
- A publisher identity on the sender machine
- A separate channel for the publisher fingerprint, such as a phone call or Signal

When using Hermes, do not run identity initialization or secret creation through the harness terminal tool. Ask the user to use their terminal for identity and keys. Keep the project and secret names generic, such as `name`, `city`, or `input`.

## Sender: pack and share a signed package

### 1. Confirm the publisher identity

Run this on the sender machine:

```bash
agentpaas identity show
```

Record the full 64-character hexadecimal publisher fingerprint. Send it through a separate channel from the package file.

If the sender has not initialized an identity, stop and ask the user to initialize it in their own terminal. The harness must not initialize identity keys through its terminal tool.

### 2. Export the project

Export the working project as a signed AgentPaaS file:

```bash
agentpaas export <project-dir> --output <file.agentpaas> --yes
```

The default export has no prebuilt image. The receiver builds locally from the package contents. If the sender intentionally includes an image, use the verified `--with-image` export option and make that choice part of the policy review.

### 3. Inspect the package

Inspect the exported file before sending it:

```bash
agentpaas bundle inspect <file.agentpaas>
```

The inspection reports 9 checks. Read each result. Check all of the following:

- Publisher fingerprint
- Signature and content digests
- Policy hosts
- Declared credentials
- Provenance
- Image status, including whether a prebuilt image is present
- Package and dependency information

The policy hosts are the destinations the component can call. Declared credentials identify secret inputs that the receiver must map locally. `agentpaas bundle inspect --json` does not expose `.policy_digest`.

### 4. Show provenance

Show the signed lineage for the package name:

```bash
agentpaas provenance show name
```

Replace `name` with the package name recorded in the package. Review the publisher and prior package events before sending the file.

### 5. Send the file and fingerprint through separate channels

Send the `.agentpaas` file through your normal file-sharing channel. Send the full 64-character fingerprint through a separate channel.

Tell the receiver to compare the fingerprint from the separate message with the fingerprint from `agentpaas bundle inspect`. A matching signature identifies the signer and shows that the signed data has not changed. It does not approve the package for execution and does not replace policy review.

## Receiver: verify before running

The receiver owns the run decision, supplies local secrets, and keeps the local audit records. Do these checks before installation or invocation.

### 1. Inspect the received package

Save the file, then inspect it locally:

```bash
agentpaas bundle inspect <file.agentpaas>
```

Read all 9 checks. Confirm the displayed publisher fingerprint matches the full fingerprint received through the separate channel. Read the policy hosts, declared credentials, provenance, dependency information, and image status.

If the fingerprint does not match, stop. Ask the sender for a new package and a new fingerprint sent through verified channels.

### 2. Read the policy digest from `agent.lock`

Open the received package contents and read the `policy_digest` value from `agent.lock`. Use the 64-character hexadecimal value exactly as stored.

Do not use `agentpaas bundle inspect --json` to obtain this value. It has no `.policy_digest` field. Do not add a `sha256:` prefix.

### 3. Install with explicit consent

Install only after the identity, integrity, hosts, credentials, provenance, and image status pass your review:

```bash
agentpaas install <file.agentpaas> --yes --confirm-fingerprint <full-64-hex> --accept-policy <64-hex-policy-digest> --allow-unlocked-deps
```

`--confirm-fingerprint` takes the complete 64-character publisher fingerprint. `--accept-policy` takes the 64-character hexadecimal value from `agent.lock`, with no `sha256:` prefix.

If you see `does not match the bundle policy digest`, the supplied policy digest does not match `agent.lock`. Read the value again and retry without a `sha256:` prefix. If the package or fingerprint changed, inspect the new package before retrying.

### 4. Find the installed reference

List installed packages:

```bash
agentpaas installed list
```

Use the exact installed reference, in the form `name@pub8`, in later commands.

### 5. Map your local credentials

Map each declared credential to a secret that belongs to the receiver:

```bash
agentpaas installed map-credential name@pub8 <declared>=<local>
```

The receiver supplies the local secret. The package does not transfer a secret, and the sender's secret must not be copied into the shared file or into the receiver's environment by the harness.

Do not add a secret through the harness terminal tool. Ask the user to create or approve local secrets in their own terminal, then map the declared name to that local secret.

### 6. Invoke the installed package

Use the input shape required by the received component. For a component that accepts a generic city input, run:

```bash
agentpaas trigger invoke name@pub8 --payload '{"city":"input"}' --wait
```

For another input shape, replace the JSON payload with the component's documented input. Do not send secrets in the payload unless the component explicitly requires that design and the receiver has approved it.

### 7. Review the local audit

Review the run and audit records on the receiver machine using the receiver's local AgentPaaS audit tools and retention process. The receiver owns those records and any external anchoring. The sender's package does not grant access to the receiver's audit history.

See [Governance and audit](/security/governance-and-audit), [Audit export](/security/audit-export), [Trust model](/security/trust-model), and [Known limitations](/security/known-limitations).

## Forking creates a new publisher hop

A receiver can fork an installed package into a new project, edit it, and publish a new signed package. The fork adds a provenance hop. Review the new publisher identity and repeat the sender checks before sharing the result.

### 1. Fork the installed reference

```bash
agentpaas fork name@pub8 <project-dir>
```

Use the exact reference from `agentpaas installed list` and a new project directory for the fork.

### 2. Pack or export the fork

Use the fork project's normal pack step, then export it as a signed package:

```bash
agentpaas export <project-dir> --output <file.agentpaas> --yes
```

If the component type has a separate pack command, use that type's pack command before this export, then repeat the same inspect, provenance, fingerprint, install, and policy-consent steps.

### 3. Inspect the new provenance

```bash
agentpaas provenance show name
```

Confirm that the provenance includes the new publisher hop before sending the forked package.

## What a signature means

A signature identifies the key that signed the package and shows whether the signed data was modified. It does not grant permission to skip policy review. A receiver still decides whether the package's hosts, declared credentials, dependencies, provenance, image status, and local secret mappings fit the receiver's policy.

Read the [Trust model](/security/trust-model) and [Known limitations](/security/known-limitations) before making claims about signatures, rebuilt images, local enforcement, or audit records.
