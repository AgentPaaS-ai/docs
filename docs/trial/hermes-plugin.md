---
id: hermes-plugin
title: Hermes plugin setup
sidebar_label: Hermes plugin setup
---

For the trial, **Hermes installs AgentPaaS for you**. You do not need a separate brew step first.

1. Install Hermes if you do not have it: https://hermes-agent.nousresearch.com/docs  
2. In Hermes, paste:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

3. If tools do not appear, type `/quit`, reopen Hermes, and paste the same line again.  
4. Confirm AgentPaaS tools work (for example ask Hermes to run doctor).

Hermes must **not** block on cloud login. When login is required, you run `agentpaas cloud login` in your own Terminal.

### Optional: install the CLI yourself

Only if you want the CLI without Hermes, or to repair a broken install: [Install on macOS (manual)](./install-macos).
