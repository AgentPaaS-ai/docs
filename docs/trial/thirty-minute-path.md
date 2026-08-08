---
id: thirty-minute-path
title: The 30-minute path
sidebar_label: The 30-minute path
---

# Run an agent you do not have to trust

Most “AI agent” demos give a model a terminal and hope for the best. That is fine until the agent follows a bad prompt, pulls a sketchy dependency, or decides the whole internet is fair game.

**This demo is different.** You will build a friendly weather agent with Hermes, pack it into AgentPaaS, and watch the platform do what product security actually requires:

- The agent runs in an **isolated container**, not as your laptop user.
- **Network is default-deny.** It cannot call random websites. Only hosts you approve (for this demo: weather + your LLM provider) go through.
- **Secrets stay out of agent code.** Your API key is brokered at request time, not dumped into the prompt or env for the model to exfiltrate.
- Every meaningful action lands in a **tamper-evident audit trail**, and the image carries a **signed lineage** so you can see what was built and by whom.

By the end you will have the same agent on your Mac and on [AgentPaaS Cloud](https://cloud.agentpaas.ai/), with proof in the audit log that governance is not a slide deck.

Follow the steps in order. Paste the Hermes lines as written. Detail pages are linked when you want a deeper dive.

---

## What you need

| | |
|--|--|
| **Mac** | Where Hermes and the local AgentPaaS runtime run |
| **Hermes** | Already installed ([Hermes docs](https://hermes-agent.nousresearch.com/docs)) |
| **Claim link** | Invite email from AgentPaaS (trial is not open signup) |
| **LLM key** | Prefer [OpenRouter](https://openrouter.ai/) and a cheap model |

You will **not** hand-install the CLI with brew in this path. You tell Hermes to install AgentPaaS from GitHub; it sets up the plugin and tools for you.

---

## Step 1: Claim your cloud trial

1. Open the **claim link** from your AgentPaaS email (keep using that browser).
2. Set a password (link Google if you want).
3. Use the **same email** the trial was issued for.
4. Confirm you can open [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) and see the console.

More detail: [Claim your trial](./claim-your-trial) · [Sign in and sessions](./sign-in-and-sessions)

---

## Step 2: Install AgentPaaS through Hermes

Open Hermes and paste **one** line:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

That is the supported onboarding path. Hermes pulls the AgentPaaS plugin and local tooling from the public GitHub project so you can pack, run, and inspect governed agents without wiring the stack by hand.

If tools do not show up, type `/quit`, reopen Hermes, and try the same line once more.

More detail: [Hermes plugin](./hermes-plugin)

---

## Step 3: Add your LLM key the safe way

Your weather agent will call an LLM. The key must **never** live in chat history or in the agent image as plain text.

Ask Hermes:

```text
Set up my publisher identity and OpenRouter credential for a weather agent. Coach me to run secret add in MY terminal only, then confirm with secret list (labels only).
```

When Hermes tells you to run a command, do it in **your** Terminal window. Typical shape:

```bash
agentpaas secret add openrouter
```

Paste the key when prompted (stdin). Hermes should only verify that a **label** exists, never print the secret.

More detail: [Your LLM key](./llm-key)

---

## Step 4: Build the weather agent (narrow internet on purpose)

Paste this **one sentence** into Hermes:

```text
Build a weather agent that uses an LLM, and responds in a friendly demeanour
```

Let Hermes scaffold, pack, and run it. When policy or egress comes up, keep the allow-list tight:

| Allowed host (example) | Why |
|------------------------|-----|
| `wttr.in` (or the weather API Hermes picks) | Fetch weather |
| `openrouter.ai` (or your LLM host) | Summarize with the model |

**Everything else is denied by default.** The agent does not get “the internet.” It gets two doors you opened. If it tries a third host, the gateway blocks it and the attempt is audited (you will see that shape in the next step).

Prefer OpenRouter + a cheap model when Hermes asks.

**You are ready for the next step when** a local invoke returns a normal friendly weather answer (not a blank error).

---

## Step 5: The big reveal - lineage and audits

This is the moment that separates AgentPaaS from “it ran in a terminal once.”

In Hermes, paste:

```text
Show me lineage and audits
```

### What you are looking at

**Lineage** answers: *what is this agent artifact, and how was it produced?*  
Expect a signed pack story: project identity, version, image digest, publisher fingerprint. That is the chain of custody for the bundle you just built, not a chat log.

**Audit** answers: *what did this run actually do under policy?*  
The harness writes a hash-chained event log for the run. You should see lifecycle events and, critically, **egress** decisions: which domains were allowed, and which were refused.

### How to read an audit event

A successful allow looks like a gateway decision that a host was on policy (event names vary slightly by version, but the idea is stable):

```json
{
  "event_type": "egress_allowed",
  "actor": "gateway",
  "payload": {
    "domain": "wttr.in"
  }
}
```

A block looks like this (illustrative):

```json
{
  "seq": 2,
  "prev_hash": "a3f2...",
  "record_hash": "b7c1...",
  "event_type": "egress_denied",
  "deployment_mode": "local",
  "actor": "gateway",
  "payload": {
    "domain": "evil.example.com",
    "reason": "policy_denied"
  }
}
```

Read that twice: **the agent asked; the platform said no; the refusal is on the permanent record.** The `prev_hash` / `record_hash` chain is why this is tamper-evident: silent edits break the chain.

On disk (optional, if you want to poke around yourself):

```bash
RUN=$(ls -t ~/.agentpaas/state/runs | head -1)
rg 'egress_allowed|egress_denied' ~/.agentpaas/state/runs/$RUN/harness-audit.jsonl | tail
```

**This is the product idea:** you can run agents that are useful *and* constrained, and you can **prove** what they were allowed to touch.

---

## Step 6 (optional but powerful): Watch a deny, then fix it

If you want the security lesson to stick, ask Hermes:

```text
Demonstrate governance: remove the weather host from policy, repack, invoke again and show the denial in the audit. Then add the host back, confirm with me, repack, and invoke successfully.
```

You should see a failed or empty weather fetch paired with `egress_denied` (or a clear policy error), then a clean run after the host is restored. That is default-deny working as designed, not a flaky network.

---

## Step 7: Run the same agent on AgentPaaS Cloud

Same governance story, managed service.

In Hermes:

```text
Make it run in the AgentPaaS cloud
```

When login is required, **you** run this in your own Terminal (same browser session as the claim):

```bash
agentpaas cloud login
```

Approve the browser prompt, then let Hermes push, deploy, bind the secret, and invoke.

More detail: [Cloud login](./cloud-login)

---

## Step 8: See it in the console

Open [https://cloud.agentpaas.ai/](https://cloud.agentpaas.ai/)

| Tab | What to notice |
|-----|----------------|
| **Agents** | Your weather agent |
| **Deployments** | The cloud deployment |
| **Runs** | The invoke you just did |
| **Cron** | Empty until you schedule |
| **Usage** | Trial usage |

You are looking for the same story as local: an agent that ran under policy, with a run you can open and inspect.

More detail: [Dashboard tour](./dashboard-tour)

---

## Step 9 (optional): Schedule it

```bash
agentpaas cloud cron set <deployment-id> --expr every_5m
```

Turn it off when you are finished:

```bash
agentpaas cloud cron disable <schedule-id>
```

More detail: [Schedule with cron](./cloud-cron)

---

## What you just proved

1. An agent can be built and run without handing it the open internet.  
2. Only approved hosts leave the sandbox; denials are audited.  
3. Secrets are brokered, not pasted into the agent.  
4. Lineage ties the artifact to a signed build story.  
5. The same model works locally and on AgentPaaS Cloud.

That is AgentPaaS: **a secure place to run agents**, not another unbounded chatbot with shell access.

Next: [Cloud pull](./cloud-pull) to edit and redeploy, or [Troubleshooting](./troubleshooting) if something failed.
