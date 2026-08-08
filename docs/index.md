---
id: index
slug: /
title: AgentPaaS documentation
---

# AgentPaaS documentation

Trial guides, cloud console, and CLI reference for the current release.

## CLI version

| Version | Status | Notes |
|---------|--------|--------|
| **[v0.3.7](./releases/v0.3.7)** | Current | Brew cask · `agentpaas version` → `CLI: 0.3.7` |

Only one public CLI line is documented right now. Older lines are not kept on this site until the next minor cut.

## Start here

| Go | Link |
|----|------|
| **Trial path** | [Trial guide](./trial/) |
| **Release notes** | [v0.3.7](./releases/v0.3.7) |
| **Console** | [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) |
| **Home** | [agentpaas.ai](https://agentpaas.ai/) |
| **How we version** | [Versioning](./versioning) |

## Install CLI (v0.3.7)

```bash
brew install --cask AgentPaaS-ai/homebrew-tap/agentpaas
# or upgrade:
brew upgrade --cask AgentPaaS-ai/homebrew-tap/agentpaas
xattr -cr "$(brew --prefix)/bin/agentpaas" "$(brew --prefix)/bin/agentpaasd"
agentpaas version   # expect CLI: 0.3.7
```

## Edit these docs

**Edit this page** (bottom of each article) opens the Markdown file on GitHub.

1. Anyone signed into GitHub can propose a change (fork → edit → **open a pull request**).
2. You (repo owner) review and merge.
3. After merge, rebuild/deploy docs so the live site updates.

Same path works for agents (Hermes, etc.): patch the `.md` file, open a PR, you accept.
