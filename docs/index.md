---
id: index
slug: /
title: AgentPaaS documentation
---

# AgentPaaS documentation

Guides for using AgentPaaS: local CLI, cloud console, and the trial path.

## CLI version

| Version | Status |
|---------|--------|
| **[v0.3.7](./releases/v0.3.7)** | Current (`agentpaas version` → `CLI: 0.3.7`) |

## Start here

| | |
|--|--|
| **New to AgentPaaS?** | [Trial guide](./trial/) |
| **What shipped in this release** | [Release notes v0.3.7](./releases/v0.3.7) |
| **Cloud console** | [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) |
| **Product home** | [agentpaas.ai](https://agentpaas.ai/) |

## Install the CLI (macOS)

```bash
brew install --cask AgentPaaS-ai/homebrew-tap/agentpaas
# already installed:
brew upgrade --cask AgentPaaS-ai/homebrew-tap/agentpaas

xattr -cr "$(brew --prefix)/bin/agentpaas" "$(brew --prefix)/bin/agentpaasd"
agentpaas version
agentpaas doctor
```

Trial access is **invite-gated**. If you do not have a claim link yet, request a trial from [agentpaas.ai](https://agentpaas.ai/).
