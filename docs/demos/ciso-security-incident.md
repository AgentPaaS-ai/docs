---
id: ciso-security-incident
title: CISO security incident review in Slack
sidebar_label: CISO incident review
---

# CISO security incident review in Slack

Use this demo to show how a security team can bring a suspicious incident into a controlled analysis run from Slack. The CISO, incident commander, and identity team share evidence in one thread. An AgentPaaS deployment uses an OpenRouter model, such as Kimi K3, to organize the evidence, assess severity, map likely attack techniques, and propose the next team actions.

The demo uses synthetic evidence. Do not paste production secrets, access tokens, customer data, or unredacted incident records into an external model provider. The OpenRouter model is a stand-in for the security team's future approved in-house model.

## The scenario

A security monitoring system flags a newly approved OAuth application called **Northstar Exporter**. Within 20 minutes of approval, the application requests access to 42 employee mailboxes and 11 shared document spaces. The identity team sees successful requests from `198.51.100.42`, a documentation-only test address, and the alert contains no confirmed data theft.

The CISO needs a fast first assessment before the team disables the application. The team needs four answers:

1. How severe is the event based on the evidence in the thread?
2. Which facts are confirmed, and which facts still need checking?
3. Which containment and investigation actions should the team take next?
4. What should the incident commander record for the next update?

The agent produces an analysis in the Slack thread. It does not disable accounts, revoke tokens, contact customers, or declare that an incident is closed. A human incident commander owns those decisions.

## What the finished demo looks like

In `#security-incident-review`, a CISO mentions the bot with a sanitized alert:

```text
@security-reviewer Review this identity incident.

Incident: IR-2026-041
Alert: OAuth application Northstar Exporter was approved by svc-reporting
at 09:14 UTC. It requested Mail.Read for 42 users and Files.ReadWrite for
11 shared spaces. The first observed request was from 198.51.100.42 at
09:32 UTC. No confirmed downloads are in the evidence attached to this
thread. The identity team has not revoked the grant.

Return a severity, confirmed facts, unknowns, likely ATT&CK techniques,
containment actions, investigation queries, and the next incident update.
```

The bot replies in the same thread with a bounded triage report. The team can add a follow-up by mentioning the bot again with new evidence. Each mention starts a new run, so include the relevant prior evidence in the follow-up.

## Before you start

- AgentPaaS CLI 0.4.1 or newer
- Hermes with the AgentPaaS plugin installed
- An AgentPaaS Cloud tenant where you can create a deployment
- An OpenRouter API key
- A Slack workspace where you are a workspace owner or administrator
- A Slack channel where you can invite the bot
- Permission to create and install a custom Slack app in that workspace
- Synthetic incident data for the demo

## Part 1: Build the security review agent

### Step 1: Install AgentPaaS in Hermes

In Hermes, paste:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

Restart Hermes when it asks. Keep the OpenRouter key out of Hermes chat.

### Step 2: Create the agent

In Hermes, paste this request:

```text
Build a security incident review agent for a CISO security team.

The agent receives a JSON payload from Slack. Analyze only the incident
text and evidence provided in that payload. Return a concise report with
these headings:

Severity: Critical, High, Medium, Low, or Unconfirmed
Confirmed facts:
Unknowns and evidence gaps:
Likely ATT&CK techniques:
Containment actions:
Investigation queries:
Next incident update:

Separate observations from recommendations. Never claim that an account was
disabled, a token was revoked, evidence was collected, or a customer was
notified unless the input explicitly says that action happened. If evidence
is missing, name the missing evidence and ask the team for it. Do not make
changes to systems. Do not include secrets or reproduce tokens in the reply.
Use the OpenRouter model configured for this agent. I will select Kimi K3
when the model identifier is available in my OpenRouter account.
```

Hermes will ask for the LLM credential during setup. In a separate Terminal, add the key through the local credential store:

```bash
printf '%s' "$OPENROUTER_API_KEY" | agentpaas secret add openrouter-key
```

When Hermes asks you to continue, tell it that `openrouter-key` is stored. The agent should use `openrouter.ai` as its declared LLM destination. If Hermes asks for a model identifier, select the Kimi K3 identifier shown in your OpenRouter account. Model names can change at the provider, so copy the identifier from that account instead of guessing it.

### Step 3: Test the analysis locally

In Hermes, paste a synthetic test payload:

```text
Run the security incident review agent with this synthetic payload:

{
  "text": "Incident IR-2026-041. OAuth application Northstar Exporter was approved by svc-reporting at 09:14 UTC. It requested Mail.Read for 42 users and Files.ReadWrite for 11 shared spaces. The first observed request was from 198.51.100.42 at 09:32 UTC. No confirmed downloads are in the evidence. The grant is still active.",
  "channel": "security-incident-review",
  "trigger": "slack"
}
```

Check that the response separates confirmed facts from unknowns and does not claim that containment has already happened. Fix the agent prompt before moving to Cloud if it invents an action or a confirmed compromise.

## Part 2: Move the agent to Cloud

### Step 4: Log in to the customer tenant

In your own Terminal, run:

```bash
agentpaas cloud login
agentpaas cloud whoami
```

Use the same browser that you used to claim the tenant. Do not paste the tenant token into Hermes or Slack.

### Step 5: Pack and push the agent

Ask Hermes:

```text
Pack this security incident review agent for AgentPaaS Cloud, run its checks,
and push the signed linux/amd64 package to the Cloud registry. Stop before
deploying and show me the package result.
```

When the package is ready, deploy it:

```text
Deploy the security incident review agent to my AgentPaaS Cloud tenant and
show me the deployment ID. Use the existing OpenRouter credential label
openrouter-key and declare openrouter.ai for the model request.
```

The deployment receives a `dep_...` ID. Record it. Hermes or the CLI performs the pack, push, deploy, and binding steps. The Cloud commands involved in the credential binding are:

```bash
agentpaas cloud secrets push openrouter-key
agentpaas cloud secrets bind dep_01J... openrouter-key --as bearer --host openrouter.ai
agentpaas cloud secrets bindings dep_01J...
```

The bindings command prints labels and destinations, never the key value. If the deployment ID or model identifier differs in your tenant, use the value Hermes reports.

### Step 6: Test the Cloud deployment before Slack

Use a deployment invoke token in your Terminal. The token is shown once, so store it locally and never paste it into Slack or Hermes:

```bash
agentpaas cloud invoke-token dep_01J...
```

Invoke the deployment with the same synthetic incident:

```bash
agentpaas cloud invoke dep_01J... \
  --body '{"text":"Incident IR-2026-041. OAuth application Northstar Exporter was approved by svc-reporting at 09:14 UTC. It requested Mail.Read for 42 users and Files.ReadWrite for 11 shared spaces. The first observed request was from 198.51.100.42 at 09:32 UTC. No confirmed downloads are in the evidence. The grant is still active.","channel":"security-incident-review","trigger":"slack"}' \
  --wait
```

Confirm that the Cloud result has the required headings and that **Runs** and **Logs** show the execution. Do this before connecting Slack. A silent Slack bot is a poor debugging interface.

## Part 3: Configure the Slack app

Use a Slack workspace you control for the first run. Ask the customer's workspace owner to install the app only after this lab flow works.

### Step 7: Create the Slack app

Open [Slack API apps](https://api.slack.com/apps), choose **Create New App**, choose **From scratch**, and select the workspace for this demo.

Keep **Socket Mode** off. AgentPaaS Cloud uses Slack's HTTP Events API Request URL.

### Step 8: Add the bot scopes

In **OAuth & Permissions**, add these bot token scopes:

```text
app_mentions:read
chat:write
```

`app_mentions:read` lets the app receive bot mentions. `chat:write` lets AgentPaaS post the final analysis into the originating thread. The current demo does not need `reactions:write` or history scopes.

Install the app to the workspace. Copy the bot token, which begins with `xoxb-`, and keep it in a password manager or environment variable. Do not put it in Hermes chat.

### Step 9: Invite the bot to the channel

Create or open `#security-incident-review`, then run this in Slack:

```text
/invite @security-reviewer
```

A workspace owner or administrator may need to approve the custom app installation. A channel member must invite the bot. For a private channel, the person running `/invite` must already belong to that channel.

### Step 10: Copy the Slack signing secret

In the Slack app's **Basic Information**, copy the **Signing Secret** and keep it separate from the bot token:

```bash
export SLACK_SIGNING_SECRET='replace-with-the-signing-secret'
export SLACK_BOT_TOKEN='xoxb-replace-with-the-bot-token'
```

## Part 4: Connect Slack to the Cloud deployment

### Step 11: Create the Slack ingress source

Create one source for this Slack app. The command prints the source ID and Request URL. It does not print the signing secret.

```bash
printf '%s' "$SLACK_SIGNING_SECRET" | agentpaas cloud ingress source create \
  --provider slack \
  --label "CISO security review Slack app" \
  --secret-stdin
```

Record the output:

```text
src_01J...
Request URL: https://cloud.agentpaas.ai/v1/hooks/src_01J...
```

One Slack app maps to one source. If the customer later wants a separate bot for another workspace or security function, create a separate source.

### Step 12: Connect the source to the deployment

Restrict this source to the review channel:

```bash
agentpaas cloud ingress connect src_01J... dep_01J... \
  --label "security incident review" \
  --filter '{"match":"all","rules":[{"field":"event.channel","op":"eq","value":"C0123"}]}'
```

Replace `C0123` with the actual Slack channel ID. The source admits Slack `app_mention` events, and the connection filter limits which channel can wake this deployment.

### Step 13: Enable Slack Events

In the Slack app, open **Event Subscriptions**:

1. Turn on **Enable Events**.
2. Paste the AgentPaaS Request URL into **Request URL**.
3. Wait for Slack to verify the URL.
4. Under **Subscribe to bot events**, add `app_mention`.
5. Save the subscription.
6. Reinstall the app if Slack requests it.

AgentPaaS answers Slack's `url_verification` challenge. It verifies `X-Slack-Signature` and `X-Slack-Request-Timestamp`, then accepts `app_mention` events. The signing timestamp window is five minutes.

## Part 5: Run the CISO demo

### Step 14: Post the incident review request

In `#security-incident-review`, mention the bot with synthetic evidence:

```text
@security-reviewer Review this identity incident.

Incident: IR-2026-041
Alert: OAuth application Northstar Exporter was approved by svc-reporting
at 09:14 UTC. It requested Mail.Read for 42 users and Files.ReadWrite for
11 shared spaces. The first observed request was from 198.51.100.42 at
09:32 UTC. No confirmed downloads are in the evidence attached to this
thread. The identity team has not revoked the grant.

Return a severity, confirmed facts, unknowns, likely ATT&CK techniques,
containment actions, investigation queries, and the next incident update.
```

Expected behavior:

- Slack sends the signed event to the Request URL.
- AgentPaaS verifies the request and returns the Slack acknowledgement without waiting for the model analysis.
- The deployment receives the mapped payload, including `text`, `channel`, `thread_ts`, `user`, `team_id`, `event_id`, and `trigger: "slack"`.
- The run appears in the Cloud console under **Runs** and **Logs**.
- The final analysis appears in the original Slack thread when the Slack reply credential is bound.

### Step 15: Bind the Slack reply token

If the run starts but no Slack reply appears, bind the bot token to the source. The accepted credential name is `slack-bot-token`.

```bash
printf '%s' "$SLACK_BOT_TOKEN" | agentpaas cloud ingress source bind-reply src_01J... \
  --credential slack-bot-token \
  --secret-stdin
```

AgentPaaS posts the final output with Slack `chat.postMessage`, using the source channel and the originating `thread_ts`. The agent cannot redirect the reply to another channel. Replies are limited to 4,000 characters.

### Step 16: Coordinate a follow-up

Have the identity lead add evidence in the same Slack thread, then mention the bot again:

```text
@security-reviewer Update IR-2026-041 with this new evidence.

The identity team found three successful token uses from the same source
address against two shared spaces. No file contents have been confirmed as
read. The application owner says the approval was unexpected.
```

Each mention starts a new run. Include the relevant prior evidence in the follow-up. The current ingress path does not provide automatic conversation memory or a wait state.

## What to show the CISO

Open the Cloud console after the Slack reply:

1. **Deployments**, show the security review agent deployment.
2. **Runs**, open the run created by the Slack mention.
3. **Logs**, show the execution record and model request path.
4. **Ingress**, show the Slack source, active connection, filter, and recent event status.
5. **Secrets**, show the `openrouter-key` and `slack-bot-token` labels without opening values.

Explain the boundaries plainly:

- Slack authenticates the inbound event with its signing secret.
- AgentPaaS checks the provider signature before a run exists.
- The connection filter decides which deployment receives an admitted event.
- The OpenRouter key and Slack bot token stay in the credential broker.
- The agent returns analysis and recommendations. It does not execute containment.
- The Cloud default tier enforces egress at the per-instance boundary through the control plane and gateway. It does not claim substrate-enforced isolation.
- OpenRouter receives the model request in this demo. A production security team should approve its data handling or replace it with the team's approved model endpoint.

Read the [threat model](../security/threat-model) and [Known limitations](../security/known-limitations) before making a stronger security claim.

## Troubleshooting

If Slack's Request URL verification fails, confirm that the source URL is copied exactly, the source is active, and the Slack signing secret was entered when the source was created. Slack verification uses `X-Slack-Signature`, not the generic `X-Agentpaas-Signature` header.

If Slack returns an acknowledgement but no run appears, confirm that the bot is in the channel, the event is an `app_mention`, the connection filter uses the correct channel ID, and the source is active. Inspect recent events:

```bash
agentpaas cloud ingress events src_01J... --tail 20
```

If the event is `filtered`, change the connection filter or use the correct Slack channel ID. If it is `duplicate`, Slack retried an event that AgentPaaS already processed.

If the run appears but the thread stays empty, bind the `xoxb-` bot token with `slack-bot-token`, confirm the bot has `chat:write`, and check that the deployment returned text or an `answer` field.

If the model invents containment actions, return to Step 2 and strengthen the instruction that recommendations are not completed actions. Test again with synthetic evidence before posting another Slack event.

## Related

- [Ingress through the gateway](../trial/ingress)
- [Agent Guided Demo](../trial/guided-demo)
- [Cloud commands](../cli/cloud)
- [Credentials and secrets](../security/credentials)
- [Threat model](../security/threat-model)
- [Known limitations](../security/known-limitations)

Slack references: [The Slack Events API](https://api.slack.com/events-api) and [Verifying requests from Slack](https://api.slack.com/authentication/verifying-requests-from-slack).
