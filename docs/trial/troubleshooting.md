---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

Use this page when the guided demo stops moving. Start with the section that matches what you see.

## Trial access and browser login

### No trial access

Request a trial at [agentpaas.ai](https://agentpaas.ai/). Open the claim link from the email you receive.

### Hermes is stuck on Cloud login

Run the login command in your Terminal:

```bash
agentpaas cloud login
```

Open the URL it prints in the same browser you used to claim the trial. Approve the login, then tell Hermes to continue.

### You used the wrong browser

Run the approval again in the browser you used for the claim. The CLI approval must use that browser.

## Hermes and installation

### AgentPaaS tools are missing

Paste this into Hermes again:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

Quit the session with `/quit`, restart Hermes, and paste the instruction again.

### macOS blocks a binary

Ask Hermes how to clear the quarantine flag. You can also right-click the app and choose **Open**.

## The agent runs without an answer

### The weather response or LLM answer is empty

Ask Hermes to check the Cloud secret bindings for the deployment. Bind your OpenRouter or other LLM secret to the host used by the deployment.

### The run shows a policy denial

Open the lineage and audit records. Look for `egress_denied`.

If the denied host is required, add only that host to the policy, then repack the agent and run it again.

## Finding results in the console

### The run is missing

Open **Runs**, filter by time, and expand the matching row.

### You want an automated schedule

Ask Hermes:

```text
Schedule this deployment every 5 minutes
```

Still stuck? Reply to your trial email thread or contact [agentpaas.ai](https://agentpaas.ai/).
