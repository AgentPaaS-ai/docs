---
id: guided-demo
slug: /trial/guided-demo
title: Guided demo
sidebar_label: Guided demo
---

# Build your first governed AI agent

In this guided demo, you will build a friendly weather agent with Hermes, run it locally, and deploy the same agent to AgentPaaS Cloud.

You will see each protection working as you use it:

- Your agent runs inside an isolated container
- Network access starts closed and opens only for the weather service and your LLM provider
- API keys stay in the credential broker instead of entering agent code or chat
- Every build and run produces lineage and audit records
- The same signed agent package works on your Mac and in AgentPaaS Cloud

By the end, you will have a working agent, a clear record of what it did, and a practical way to govern its access as it runs.

Follow the steps in order. Paste the Hermes prompts exactly as written, and run any private credential commands in your own Terminal window.

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

Open the claim link in your invite email using the browser you plan to use for the demo. Create your password, or choose Google sign-in. Use the same email address that received the trial invitation.

Your trial is ready when you can open https://cloud.agentpaas.ai/ and see the AgentPaaS console.

---

## Step 2: Install AgentPaaS in Hermes

In Hermes, paste:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

Hermes installs the plugin and local tooling. You will be prompted to restart the session, so the plugin can be installed. Quit (`/quit`) and restart your hermes session.

---

## Step 3: Build the weather agent

In Hermes:

```text
Build a weather agent that uses an LLM, and responds in a friendly demeanour
```

During the build, Hermes will ask you to add an LLM key, such as OpenRouter or another provider. Paste the key in a separate Terminal window when prompted. Hermes will also ask you to set your publisher identity using your name to create a fingerprint. Follow the instructions as they appear. Never put the key in chat.

You are ready when a local invoke returns a friendly weather answer.

---

## Step 4: Lineage and Audits

In Hermes:

```text
Show me lineage and audits
```

**Lineage** is the signed build story of the agent artifact (who packed what version and digest).  
**Audit** is the run log under policy, including **egress_allowed** and **egress_denied**.

If the agent tried a website that was not on the allow list, you should see a denial recorded by the gateway. That is the product working.

Optional:

This shows how policy changes affect an agent.  
Remove the weather host from the policy file, observe the denial in the audit, then add it back and confirm the agent can run again.

```text
Demonstrate governance: remove the weather host from policy, repack, invoke and show the denial in the audit. Then add the host back, confirm with me, repack, and invoke successfully.
```

---

## Step 5: Run it on AgentPaaS Cloud

In Hermes:

```text
Make it run in the AgentPaaS cloud
```

Hermes will ask you to login to the Cloud, so the CLI can connect to it. In your terminal:

```bash
agentpaas cloud login
```

<strong className="ap-alert-red">Cut and paste the link provided in the same browser you used to claim the trial,</strong> then tell Hermes to continue. Hermes will now build the agent, push it to the Cloud, deploy it, bind secrets to the Cloud gateway, and invoke it to show you the results.

---

## Step 6: Look in the console

Open [cloud.agentpaas.ai](https://cloud.agentpaas.ai/) and check **Agents**, **Deployments**, and **Runs**. Expand a row to see detail.

Optional: Schedule an automated run

```text
Schedule this cloud deployment every 5 minutes, then show me how to disable it.
```

Or explore tabs yourself: [Console tour](./dashboard-tour).

---

## What you proved

You built and ran an agent under runtime controls, then deployed the same governed agent to AgentPaaS Cloud. Here is what the demo showed:

1. **The agent ran inside an isolated container.** Its work stayed inside the AgentPaaS runtime instead of running as your normal Mac user.
2. **The LLM could not bypass the policy.** It never saw your keys, and the gateway denied egress to any site outside the approved policy. The policy-file test produced a recorded denial when the weather host was removed.
3. **Secrets stayed in the credential broker.** You entered the LLM key in your separate Terminal. The key stayed out of chat and agent source while the Cloud gateway used it for the request.
4. **The build and run were recorded.** Publisher identity created a fingerprint for the build. Lineage connected the signed artifact to its publisher, and the audit showed allowed and denied egress decisions.
5. **The same governed agent ran locally and in the Cloud.** You built it on your Mac, pushed the signed package, deployed it, bound the secret through the gateway, and invoked it in AgentPaaS Cloud.

You have now seen how AgentPaaS contains an agent's access, records its actions, and carries the same controls from local development into the Cloud.

Ready to run agents with your team? Sign up for the **TEAM** or **ENTERPRISE** plan in the [AgentPaaS Cloud console](https://cloud.agentpaas.ai/).

If something fails: [Troubleshooting](./troubleshooting).
