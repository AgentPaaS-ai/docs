---
id: thirty-minute-path
title: The 30-minute path
sidebar_label: The 30-minute path
---

This is the shortest path from zero to a weather agent running on AgentPaaS Cloud. Follow the steps **in order**. Each step is one action. When something needs more detail, use the linked page, then come back here.

**Time:** about 30 minutes the first time.  
**You need:** a Mac, a claim link from AgentPaaS, and an [OpenRouter](https://openrouter.ai/) API key (or another HTTPS LLM key you already use).

If you get stuck, open [Troubleshooting](./troubleshooting).

---

## Before you start

Check these once:

1. You received a **claim link** email from AgentPaaS (trial is invite-only).
2. You can install apps with Homebrew on this Mac.
3. You have (or can create) an OpenRouter account for a cheap model key.

You do **not** need to understand Docker, Cloudflare, or how agents work inside yet. The CLI and Hermes walk you through the rest.

---

## Step 1: Claim your trial in the browser

1. Open the **claim link** from your email (use a browser you will keep using).
2. Set a password (and link Google if you want).
3. Use the **same email** the trial was issued for.
4. You should land on the cloud dashboard (or a short Hermes handoff, then the dashboard).

**Done when:** you can open [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) and see your console after signing in.

Details: [Claim your trial](./claim-your-trial) · [Sign in and sessions](./sign-in-and-sessions)

---

## Step 2: Install the AgentPaaS CLI on your Mac

Open **Terminal** and run:

```bash
brew install --cask AgentPaaS-ai/homebrew-tap/agentpaas
```

If macOS blocks the tools the first time:

```bash
xattr -cr "$(brew --prefix)/bin/agentpaas" "$(brew --prefix)/bin/agentpaasd"
```

Start the local service and check health:

```bash
agentpaas daemon start
agentpaas version
agentpaas doctor
```

**Done when:** `agentpaas version` shows **CLI: 0.3.7** (or newer) and `doctor` looks healthy.

Details: [Install on macOS](./install-macos)

---

## Step 3: Install Hermes and the AgentPaaS plugin

Hermes is the coding agent UI that drives AgentPaaS for you. Install Hermes the usual way for your machine, then install the AgentPaaS plugin.

In Hermes, paste this **exactly**:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

Let it finish. If it asks for permissions or a restart, accept and continue.

**Done when:** Hermes has AgentPaaS tools available (you can ask it about AgentPaaS without it saying the plugin is missing).

Details: [Hermes plugin](./hermes-plugin)

---

## Step 4: Store your LLM key (do this yourself)

Your agent needs an LLM. Prefer **OpenRouter** and a cheap model for the trial.

1. Create or copy an API key from your provider.
2. In **your** Terminal (not in chat), add it so the key never appears in the conversation:

```bash
agentpaas secret add openrouter
```

When prompted, paste the key and press Enter. Hermes should only **check** that a secret exists, not ask you to paste the key into chat.

**Done when:** `agentpaas secret list` shows a label for your key (values are never printed).

Details: [Your LLM key](./llm-key)

---

## Step 5: Build a simple weather agent with Hermes

In Hermes, paste this **one sentence** (do not over-specify):

```text
Build a weather agent that uses an LLM, and responds in a friendly demeanour
```

Let Hermes scaffold, pack, and run the agent. Answer prompts if it asks about model or policy. Prefer OpenRouter + a cheap model when offered.

**Done when:** the agent runs locally and you get a normal weather-style answer (not an empty error).

---

## Step 6: Confirm lineage and audits locally

Still in Hermes, paste:

```text
Show me lineage and audits
```

**Done when:** you see that the run was recorded (lineage / audit style output). That is the “governed” part working on your Mac.

---

## Step 7: Put the same agent on AgentPaaS Cloud

In Hermes, paste:

```text
Make it run in the AgentPaaS cloud
```

When Hermes asks you to log in to cloud:

1. Open **your own Terminal** (not Hermes’s hidden shell if it blocks).
2. Run:

```bash
agentpaas cloud login
```

3. Approve the browser window in the **same browser** you used to claim the trial.
4. Return to Hermes and let it continue (push / deploy / invoke).

**Done when:** Hermes reports a cloud deployment and a successful invoke (or points you at a run in the console).

Details: [Cloud login](./cloud-login)

---

## Step 8: Look at the result in the console

Open [https://cloud.agentpaas.ai/](https://cloud.agentpaas.ai/) and sign in if needed.

Click through these tabs (read-only is fine for the trial):

| Tab | What to notice |
|-----|----------------|
| **Agents** | Your weather agent project |
| **Deployments** | A deployment for that agent |
| **Runs** | The invoke you just did |
| **Cron** | Empty until you schedule something |
| **Usage** | Rough usage for the trial |

**Done when:** you can find the agent, a deployment, and at least one run.

Details: [Dashboard tour](./dashboard-tour)

---

## Step 9 (optional): Schedule a run every 5 minutes

Only if you want a repeating invoke. In Terminal:

```bash
agentpaas cloud cron list
agentpaas cloud cron set <deployment-id> --expr every_5m
```

Replace `<deployment-id>` with the id from the Deployments tab (or from `agentpaas cloud` output). Turn it off when you are done:

```bash
agentpaas cloud cron disable <schedule-id>
```

Details: [Schedule with cron](./cloud-cron)

---

## You are done

You have:

1. A claimed cloud trial  
2. CLI + daemon on the Mac  
3. A packed weather agent  
4. Local lineage/audit  
5. The same agent on cloud with a run visible in the console  

Next ideas:

- Edit and redeploy: [Cloud pull](./cloud-pull)  
- More console tabs: [Dashboard tour](./dashboard-tour)  
- Problems: [Troubleshooting](./troubleshooting)
