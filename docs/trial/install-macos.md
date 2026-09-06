# Set up AgentPaaS

Set up AgentPaaS through Hermes for the guided path. You can also install and use the AgentPaaS CLI directly in your terminal.

## Sign in

Open the one-time claim link from your trial email in the browser you plan to use. Set your password, then keep using that browser when the CLI asks you to approve access.

## Install Hermes and the AgentPaaS plugin

Install [Hermes](https://hermes-agent.nousresearch.com/docs) if needed. In Hermes, paste:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

Hermes installs the AgentPaaS plugin and local tooling. Restart the Hermes session when prompted. If the AgentPaaS tools do not appear, type `/quit` and reopen Hermes.

## Install the CLI directly

Use the CLI path when you want to install AgentPaaS directly in your terminal:

```bash
brew tap AgentPaaS-ai/homebrew-tap
brew install agentpaas
xattr -cr /opt/homebrew/bin/agentpaas /opt/homebrew/bin/agentpaasd /opt/homebrew/bin/agentpaas-harness-linux
agentpaas doctor
agentpaas version
```

Use CLI 0.4.0 or newer. On Intel Macs, Homebrew binaries are under `/usr/local/bin`. If macOS blocks a binary, clear its quarantine attribute or use Finder's Open action.

## Log in to Cloud

When Hermes asks for cloud access, run this in your terminal:

```bash
agentpaas cloud login
```

Approve access in the same browser session you used for the trial claim.
