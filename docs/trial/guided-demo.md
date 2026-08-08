---
id: guided-demo
slug: /trial/guided-demo
title: Guided demo
sidebar_label: Guided demo
---

# Run an agent you do not have to trust

Most AI agent demos give a model a terminal and hope for the best. That breaks down when the agent follows a bad prompt, pulls a risky dependency, or treats the whole internet as fair game.

**This demo is different.** With Hermes you build a friendly weather agent, pack it into AgentPaaS, and see real product security:

- Isolated container, not your laptop user account  
- **Default-deny network** - only hosts you approve (weather + LLM)  
- **Brokered secrets** - API keys never sit in agent code or chat  
- **Lineage and audit** - proof the agent is secure and is being governed and audited  

You finish with the same agent on your Mac and on [AgentPaaS Cloud](https://cloud.agentpaas.ai/).

Follow the steps in order. Prefer pasting the Hermes lines as written.

---

## What you need

| | |
|--|--|
| **Mac** | Hermes + local AgentPaaS runtime |
| **Hermes** | [Install Hermes](https://hermes-agent.nousresearch.com/docs) if needed |
| **Trial invite** | Claim email from AgentPaaS ([get it here](https://agentpaas.ai/)) |
| **LLM key** | Prefer [OpenRouter](https://openrouter.ai/) and a cheap model |

---

## Step 1: Claim your trial

Open the claim link from your email in a browser you will keep using. Set a password (Google optional). Use the same email the trial was issued for.

You are done when you can open [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) and see the console.

---

## Step 2: Install AgentPaaS in Hermes

In Hermes, paste:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

Hermes installs the plugin and local tooling. If tools are missing, `/quit`, reopen Hermes, and paste again.

---

## Step 3: Add your LLM key (you paste once, privately)

Ask Hermes:

```text
Set up my publisher identity and OpenRouter credential for a weather agent. Coach me to add the secret in MY terminal only, then confirm labels only with secret list.
```

When Hermes asks you to run a command, do it in **your** Terminal window and paste the key at the prompt. Never put the key in chat.

---

## Step 4: Build the weather agent

In Hermes:

```text
Build a weather agent that uses an LLM, and responds in a friendly demeanour
```

Keep egress tight: weather host + OpenRouter (or your LLM host) only. Everything else is denied by default.

You are ready when a local invoke returns a friendly weather answer.

---

## Step 5: The big reveal - lineage and audits

In Hermes:

```text
Show me lineage and audits
```

**Lineage** is the signed build story of the agent artifact (who packed what version and digest).  
**Audit** is the run log under policy, including **egress_allowed** and **egress_denied**.

If the agent tried a website that was not on the allow list, you should see a denial recorded by the gateway. That is the product working.

Optional teaching moment:

```text
Demonstrate governance: remove the weather host from policy, repack, invoke and show the denial in the audit. Then add the host back, confirm with me, repack, and invoke successfully.
```

---

## Step 6: Run it on AgentPaaS Cloud

In Hermes:

```text
Make it run in the AgentPaaS cloud
```

When login is needed, Hermes should **not** hang in a browser for you. In **your** Terminal:

```bash
agentpaas cloud login
```

Approve in the **same browser** you used to claim the trial, then tell Hermes to continue (push, deploy, bind secret, invoke).

---

## Step 7: Look in the console

Open [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) and check **Agents**, **Deployments**, and **Runs**. Expand a row to see detail.

Optional schedule (ask Hermes in plain language):

```text
Schedule this cloud deployment every 5 minutes, then show me how to disable it.
```

Or explore tabs yourself: [Console tour](./dashboard-tour).

---

## What you proved

1. The agent never got the open internet - only approved hosts.  
2. Denials and allows are audited.  
3. Secrets stayed out of chat and agent source.  
4. Lineage ties the artifact to a signed build.  
5. The same governed agent runs locally and in cloud.

That is AgentPaaS: a secure place to run agents.

If something fails: [Troubleshooting](./troubleshooting).
