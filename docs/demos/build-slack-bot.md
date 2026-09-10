---
id: build-slack-bot
slug: /demos/build-slack-bot
title: Build a Slack Bot
sidebar_label: Build a Slack Bot
---

# Build a Slack Bot

This demo shows you how to build an Agent to interact with from a Slack channel. You impart skills to the agent through prompts, deploy the agent to AgentPaaS Cloud, and set up Slack to call your agent when the bot's name is mentioned.

The example is a small security review bot. A security engineer pastes a customer's CVE warning into Slack. The bot researches the CVE and replies with a recommendation in the same thread.

Use synthetic data for this demo. Keep production secrets, access tokens, and customer records out of an external model provider.

## The scenario

A customer calls support and says:

```text
Our automated run flagged CVE-2024-3094 in the payments-api image. Is our
service exposed, and do we need to fix anything before the next release?
```

The security engineer sends that message to the Slack bot. The bot checks the CVE's public advisories, reviews the details in the message, and returns a short answer:

- What the CVE affects
- Whether the customer's service appears to use the affected path
- Whether to update a dependency or rebuild the image
- What the security engineer should verify before replying to the customer

The bot only sees the text in the current Slack mention. Put the customer question and the relevant facts in the message. The bot does not change a repository, rebuild an image, or contact the customer.

## Before you start

- AgentPaaS CLI 0.4.1 or newer
- Hermes with the AgentPaaS plugin installed
- An AgentPaaS Cloud tenant
- An OpenRouter API key
- A Slack workspace where you can install a custom app
- A Slack channel where you can invite the bot

## Part 1: Build the agent

### Step 1: Install AgentPaaS in Hermes

In Hermes, paste:

```text
Install from https://github.com/AgentPaaS-ai/agentpaas
```

Restart Hermes when it asks.

### Step 2: Give the agent its instructions

In Hermes, paste:

```text
Build a security review agent that I can call from Slack.

The agent receives the text of one Slack mention. Treat that message as the
complete context for the run. Do not rely on earlier Slack messages or a
previous run.

When the message contains a CVE question, research the CVE using the agent's
HTTP capability. Return these headings:

What the CVE affects:
Assessment:
Recommendation:
What to verify:
Reply to customer:

Keep confirmed facts separate from assumptions. Say when the message does not
contain enough information. Recommend a dependency update or image rebuild
when the evidence supports it. Do not claim that a fix was applied. Do not
change a repository, image, account, or customer record. Do not contact the
customer. Do not include secrets in the reply.

Use the OpenRouter model configured for this agent. I will select the Kimi K3
model identifier shown in my OpenRouter account.
```

Hermes will ask for the LLM credential during setup. In a separate Terminal, add the key through the local credential store:

```bash
printf '%s' "$OPENROUTER_API_KEY" | agentpaas secret add openrouter-key
```

Tell Hermes that `openrouter-key` is stored. Allow the agent to reach `openrouter.ai`, `nvd.nist.gov`, and `www.openwall.com` for the model request and CVE research. If Hermes asks for a model identifier, select the Kimi K3 identifier shown in your OpenRouter account.

### Step 3: Test the agent locally

In Hermes, paste:

```text
Review this customer question:

Our automated run flagged CVE-2024-3094 in the payments-api image. The service
is a statically linked Go binary and does not run an SSH server. Is the service
exposed, and do we need to fix anything before the next release?

Research the CVE and return the five required headings. State what still needs
verification.
```

Check that the agent researches the CVE, distinguishes the SSH-related impact from the customer's service details, and gives a recommendation without claiming that a fix has already happened.

## Part 2: Deploy the agent

### Step 4: Log in to Cloud

In your own Terminal, run:

```bash
agentpaas cloud login
agentpaas cloud whoami
```

Use the same browser that you used to claim the tenant. Do not paste the tenant token into Hermes or Slack.

### Step 5: Pack and deploy

Ask Hermes:

```text
Pack this security review agent for AgentPaaS Cloud, run its checks, push the
signed linux/amd64 package, and deploy it to my Cloud tenant. Show me the
deployment ID. Bind openrouter-key to openrouter.ai and allow the CVE research
hosts nvd.nist.gov and www.openwall.com.
```

Record the deployment ID, which has the form `dep_...`. You can inspect the binding from your Terminal:

```bash
agentpaas cloud secrets push openrouter-key
agentpaas cloud secrets bind dep_01J... openrouter-key --as bearer --host openrouter.ai
agentpaas cloud secrets bindings dep_01J...
```

The bindings command prints labels and destinations. It does not print the key.

### Step 6: Test the Cloud deployment

Mint an invoke token in your Terminal. Store it locally and do not paste it into Slack or Hermes:

```bash
agentpaas cloud invoke-token dep_01J...
```

Invoke the deployed agent with the same plain customer question:

```bash
agentpaas cloud invoke dep_01J... \
  --body '{"query":"Our automated run flagged CVE-2024-3094 in the payments-api image. The service is a statically linked Go binary and does not run an SSH server. Is the service exposed, and do we need to fix anything before the next release?"}' \
  --wait
```

Confirm the result has the five required headings. Check **Runs** and **Logs** in the Cloud console before connecting Slack.

## Part 3: Set up the Slack app

Use a Slack workspace you control for the first run. Ask the customer's workspace owner to install the app only after this flow works.

### Step 7: Create a blank Slack app

Open [Slack API apps](https://api.slack.com/apps), choose **Create New App**, choose **From scratch**, and select your workspace.

Keep **Socket Mode** off. AgentPaaS Cloud uses Slack's HTTP Events API Request URL.

### Step 8: Add the bot scopes

Open **OAuth & Permissions** and add these bot token scopes:

```text
app_mentions:read
chat:write
```

`app_mentions:read` lets Slack send mentions to the app. `chat:write` lets AgentPaaS post the final answer in the originating thread.

Click **Install to Workspace**. Copy the bot token, which begins with `xoxb-`. Keep it in a password manager or an environment variable. Do not put it in Hermes chat.

### Step 9: Create the Slack channel and invite the bot

Create or open `#security-review`, then run this in Slack:

```text
/invite @incident-review
```

A workspace owner or administrator may need to approve the custom app. For a private channel, the person running `/invite` must already belong to that channel.

### Step 10: Copy the signing secret

In the Slack app's **Basic Information**, copy the **Signing Secret** and keep it separate from the bot token:

```bash
export SLACK_SIGNING_SECRET='replace-with-the-signing-secret'
export SLACK_BOT_TOKEN='xoxb-replace-with-the-bot-token'
```

## Part 4: Connect Slack to AgentPaaS

### Step 11: Create the ingress source

Create one AgentPaaS source for this Slack app. The command prints the source ID and Request URL. It does not print the signing secret.

```bash
printf '%s' "$SLACK_SIGNING_SECRET" | agentpaas cloud ingress source create \
  --provider slack \
  --label "security review Slack app" \
  --secret-stdin
```

Expected output:

```text
src_01J...
Request URL: https://cloud.agentpaas.ai/v1/hooks/src_01J...
```

A Slack app has one Request URL for this source. The source verifies Slack requests and passes accepted events to its connections.

### Step 12: Connect the source to the deployment

Use the Slack channel ID in the filter. In this example, `C0123` represents `#security-review`:

```bash
agentpaas cloud ingress connect src_01J... dep_01J... \
  --label "security review agent" \
  --filter '{"match":"all","rules":[{"field":"event.channel","op":"eq","value":"C0123"}]}'
```

The connection determines which deployed agent wakes for the event. Without a filter, the connection accepts every Slack `app_mention` event admitted by the source.

### Step 13: Set Slack's Request URL

In the Slack app, open **Event Subscriptions**:

1. Turn on **Enable Events**.
2. Paste the AgentPaaS Request URL into **Request URL**.
3. Wait for Slack to verify the URL.
4. Under **Subscribe to bot events**, add `app_mention`.
5. Save the subscription.
6. Reinstall the app if Slack requests it.

AgentPaaS answers Slack's `url_verification` challenge. It checks `X-Slack-Signature` and `X-Slack-Request-Timestamp`, acknowledges the event, and admits the `app_mention` event to the matching connection.

### Step 14: Bind the bot token for replies

Bind the Slack bot token to the source. The accepted credential name is `slack-bot-token`:

```bash
printf '%s' "$SLACK_BOT_TOKEN" | agentpaas cloud ingress source bind-reply src_01J... \
  --credential slack-bot-token \
  --secret-stdin
```

AgentPaaS posts the final answer with Slack `chat.postMessage`, using the channel and thread from the inbound mention. Replies are limited to 4,000 characters.

## Part 5: Run the demo

### Step 15: Send the customer question

In `#security-review`, mention the bot and paste the customer's plain-language question:

```text
@incident-review A customer says their automated run flagged CVE-2024-3094 in the payments-api image. The service is a statically linked Go binary and does not run an SSH server. Please research the CVE, tell me whether the service appears exposed, recommend an update or rebuild if needed, and give me a short reply I can send to the customer.
```

The bot receives the text in this message as its input. It researches the CVE and replies in the same Slack thread.

Expected behavior:

- Slack sends the signed event to the AgentPaaS Request URL.
- AgentPaaS verifies the signature and acknowledges Slack without waiting for the model response.
- The connection filter routes the mention to the deployed agent.
- The agent researches the allowed public sources through its gateway path.
- The run appears under **Runs** and **Logs** in the Cloud console.
- The final answer appears in the Slack thread when `slack-bot-token` is bound.

### Step 16: Send a follow-up with the new facts

Each mention starts a new run. Include the facts again when the answer depends on them:

```text
@incident-review New information for the same customer question: the final image SBOM has no xz-utils package, and the binary has no liblzma linkage. Reassess the CVE-2024-3094 exposure and give me the customer reply.
```

The bot can assess the new message, but it does not remember the previous run.

## What this demo proves

You built an agent with a prompt, deployed it to AgentPaaS Cloud, connected a Slack app to the deployment, and received a researched answer in Slack.

The Slack signing secret and bot token stay outside the agent code. The OpenRouter key is brokered through the Cloud gateway. The agent can recommend a dependency update or image rebuild, while a human decides what to change and what to tell the customer.

You can create more complex workflows, such as scanning a GitHub repository for vulnerabilities, creating a release pipeline, or using multiple bots to review the same issue. AgentPaaS lets you build and test those workflows on the platform.

## Troubleshooting

If Slack's Request URL verification fails, confirm that the source is active, the URL is copied exactly, and the Slack signing secret was entered when the source was created. Slack uses `X-Slack-Signature`, not `X-Agentpaas-Signature`.

If Slack acknowledges the message but no run appears, confirm that the bot is in the channel, the event is an `app_mention`, and the connection filter uses the correct channel ID. Inspect recent events:

```bash
agentpaas cloud ingress events src_01J... --tail 20
```

If the event is `filtered`, change the connection filter or use the correct channel ID. If it is `duplicate`, AgentPaaS already processed that Slack event.

If the run appears but the thread stays empty, bind the `xoxb-` token with `slack-bot-token`, confirm the bot has `chat:write`, and check that the deployment returned text or an `answer` field.

If the agent says it has fixed the dependency, rebuild, or contacted the customer, revise the prompt. The agent can recommend those actions. It cannot claim they happened without evidence in the current message.

## Related

- [Build a Weather Agent](./build-weather-agent)
- [Ingress through the gateway](../trial/ingress)
- [Cloud commands](../cli/cloud)
- [Credentials and secrets](../security/credentials)
- [Threat model](../security/threat-model)
- [Known limitations](../security/known-limitations)

Slack references: [The Slack Events API](https://api.slack.com/events-api) and [Verifying requests from Slack](https://api.slack.com/authentication/verifying-requests-from-slack).
