---
id: install
title: Install the CLI
sidebar_label: Install
---

## Recommended (macOS)

```bash
brew install --cask AgentPaaS-ai/homebrew-tap/agentpaas
# upgrade later:
brew upgrade --cask AgentPaaS-ai/homebrew-tap/agentpaas
```

If macOS quarantines the binaries:

```bash
xattr -cr "$(brew --prefix)/bin/agentpaas" "$(brew --prefix)/bin/agentpaasd"
```

## Verify

```bash
export PATH="/opt/homebrew/bin:$PATH"
agentpaas version
agentpaas doctor
```

Expect **CLI: 0.3.7** (or newer) on current brew.

## Hermes path

Coding agents can install the plugin and tooling with:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

That still ends with a working `agentpaas` on PATH for the commands in this section.

## Requirements

| | |
|--|--|
| OS | macOS for local runtime |
| Container | Docker or Colima for pack/run |
| Cloud | Optional; needs trial claim + `agentpaas cloud login` |
