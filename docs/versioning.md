---
id: versioning
title: Versions
---

AgentPaaS versions a few surfaces separately:

| Surface | How you see it |
|---------|----------------|
| **CLI / daemon** | `agentpaas version` (e.g. `0.3.7`) and the brew cask |
| **Cloud console** | [cloud.agentpaas.ai](https://cloud.agentpaas.ai) — always the live product |
| **These docs** | Match the current CLI line on the [home page](/) |

### What to install

Use the **current** CLI version listed on the docs home page unless a guide says otherwise.

```bash
brew upgrade --cask AgentPaaS-ai/homebrew-tap/agentpaas
agentpaas version
```

### Cloud vs CLI

Cloud features (dashboard tabs, APIs) ship on the managed service. The CLI is what you install on your Mac. Docs call out when a feature needs a minimum CLI version (for example `cloud cron` needs **0.3.7+**).
