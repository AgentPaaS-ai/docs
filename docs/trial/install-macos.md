---
id: install-macos
title: Install on macOS (manual)
sidebar_label: Install on macOS (manual)
---

Most trial users should skip this page and use Hermes instead:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

See [Hermes plugin setup](./hermes-plugin).

---

Use this only if you want the **AgentPaaS CLI** on the Mac without Hermes, or to repair a local install.

Requires **CLI 0.3.7+** and Docker/Colima for local pack/run.

```bash
brew install --cask AgentPaaS-ai/homebrew-tap/agentpaas
export PATH="/opt/homebrew/bin:$PATH"
# If macOS blocks the binary:
xattr -cr "$(brew --prefix)/bin/agentpaas" "$(brew --prefix)/bin/agentpaasd" 2>/dev/null || true
agentpaas version
agentpaas daemon start
agentpaas doctor
```

Expect doctor checks green. Keep the daemon running while packing and running agents.
