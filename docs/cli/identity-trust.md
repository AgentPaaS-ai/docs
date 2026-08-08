---
id: identity-trust
title: Identity and trust
sidebar_label: Identity and trust
---

## identity

Publisher identity for signed packs:

```bash
agentpaas identity init --name my-org
agentpaas identity show
agentpaas identity export
agentpaas identity import <file>
```

## trust

```bash
agentpaas trust list
agentpaas trust add <key>
agentpaas trust remove <id>
```

## confirm / confirmations

Trust-boundary changes may require explicit approval:

```bash
agentpaas confirmations
agentpaas confirm <id> --yes
```

## install / installed / export / fork / bundle

```bash
agentpaas export ./my-agent
agentpaas install ./weather.agentpaas --yes
agentpaas installed list
agentpaas fork <ref> ./editable-copy
agentpaas bundle inspect ./weather.agentpaas
```

## provenance

```bash
agentpaas provenance <agent-or-bundle>
```

Shows the signed lineage chain for an installed agent or bundle.
