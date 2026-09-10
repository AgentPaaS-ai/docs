---
id: ciso-security-incident
title: CISO CVE review in Slack
sidebar_label: CISO CVE review
---

# CISO CVE review in Slack

Use this demo to show a security team handling a customer call about a vulnerability warning in an automated run. The security engineer pastes one complete incident packet into Slack. The AgentPaaS deployment receives that packet, researches the named vulnerability, checks the supplied repository and internal architecture evidence, and returns a recommendation in the Slack thread.

Each mention is a new run. The bot has no memory of earlier Slack messages. Every invocation in this demo includes the customer call, scan result, repository facts, architecture notes, source URLs, and the question for the security team.

This demo uses synthetic customer data and a fictional repository. Do not paste production secrets, access tokens, customer data, or unredacted incident records into an external model provider. OpenRouter and Kimi K3 are stand-ins for the security team's future approved in-house model.

## The scenario

A customer calls the platform support team after an automated security run reports **CVE-2024-3094**, the XZ Utils backdoor vulnerability. The customer asks, "The new automated run shows a critical CVE warning. Fix it before our next release."

The CISO's security engineer needs to answer the customer without guessing. The team must determine:

1. Whether the vulnerable package is present in the final production image or only in a discarded build layer
2. Whether the service uses the vulnerable library at runtime
3. What the public vulnerability sources say about affected versions and exploitation
4. Whether the right fix is a dependency update, a base-image rebuild, or a documented false positive
5. What the security engineer should tell the customer and what evidence must be collected next

The supplied repository evidence says the service builds a Go binary in a Debian builder stage, then copies the binary into a minimal runtime image. The repository does not import or link `liblzma`. The scanner report identifies `xz-utils` in the builder layer. The agent must still verify the CVE facts and recommend a rebuild and rescan rather than dismissing the warning from the package name alone.

The agent produces analysis and a customer response draft. It does not change a repository, rebuild an image, suppress a finding, or contact the customer. The security engineer decides what to do next.

## What the finished demo looks like

In `#security-incident-review`, the security engineer mentions the bot with a complete packet:

```text
@incident-review Analyze this customer security call. Treat the JSON packet below as the complete context for this run. Do not rely on earlier Slack messages.

{
  "incident_id": "IR-2026-052",
  "customer": "Northstar Payments",
  "request": "The automated run shows a new critical CVE warning. Fix it before our next release.",
  "cve": "CVE-2024-3094",
  "scan": {
    "tool": "synthetic-sbom-scan",
    "image": "northstar/payments-api:2026.09.10",
    "finding": "xz-utils 5.6.1 in build layer builder-0",
    "final_image_contains_package": "unknown",
    "runtime_linkage": "unknown"
  },
  "repository": {
    "url": "https://github.com/example/northstar-payments-api",
    "commit": "8f31c2e",
    "dockerfile_excerpt": "FROM debian:bookworm-slim AS builder; RUN apt-get install -y build-essential xz-utils; RUN go build -o /out/payments-api ./cmd/payments-api; FROM registry.example.net/distroless/static-debian12; COPY --from=builder /out/payments-api /payments-api",
    "go_mod_excerpt": "module example.com/northstar/payments-api\n\ngo 1.23\n\nrequire example.com/internal/ledger v2.8.1",
    "sbom_excerpt": "builder-0: xz-utils 5.6.1; runtime-0: no xz-utils package; runtime-0: no liblzma linkage"
  },
  "internal_architecture_excerpt": "The payments API runtime is a statically linked Go binary. The Debian builder layer is discarded. Production starts only the copied binary. Release policy requires rebuilding the final image and attaching a fresh SBOM after a base-image or build-tool change.",
  "sources_to_check": [
    "https://nvd.nist.gov/vuln/detail/CVE-2024-3094",
    "https://www.openwall.com/lists/oss-security/2024/03/29/4"
  ],
  "questions": [
    "Is the final runtime exposed?",
    "What should we change before release?",
    "What should we tell Northstar Payments?",
    "What evidence should the security engineer collect next?"
  ]
}

Research the public sources with the agent's HTTP capability when available. Return:
Severity:
Decision:
Confirmed facts:
Public-source findings:
Exposure assessment:
Recommended fix:
Evidence to collect:
Customer response draft:
Open questions:
```

The bot replies in the same thread with a structured assessment. The reply should say that the supplied evidence points to a builder-layer finding with no confirmed runtime exposure, then recommend rebuilding with a fixed builder package, generating a fresh SBOM, checking the final image, and retaining the scan evidence. It must label that conclusion as conditional until the final image digest and linkage check are verified.

## Before you start

- AgentPaaS CLI 0.4.1 or newer
- Hermes with the AgentPaaS plugin installed
- An AgentPaaS Cloud tenant where you can create a deployment
- An OpenRouter API key
- A Slack workspace where you are a workspace owner or administrator
- A Slack channel where you can invite the bot
- Permission to create and install a custom Slack app in that workspace
- Synthetic customer, repository, and scanner data

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
Build a security CVE review agent for a CISO security team.

The agent receives one JSON payload from Slack. The payload's text contains
a complete incident packet. Treat that packet as the complete context for the
run. Do not rely on earlier Slack messages, hidden memory, or a previous run.
If the packet is missing a field, say that it is missing.

Use the supplied public source URLs to research the named CVE with the
agent's HTTP capability when available. State which sources were fetched and
which could not be reached. Treat repository excerpts and internal
architecture excerpts as claims to assess, not as proof that a remediation
was completed.

Return exactly these headings:

Severity: Critical, High, Medium, Low, or Unconfirmed
Decision:
Confirmed facts:
Public-source findings:
Exposure assessment:
Recommended fix:
Evidence to collect:
Customer response draft:
Open questions:

Separate confirmed evidence, public-source findings, inference, and
recommendation. For a finding in a discarded build layer, check whether the
final image contains the package or links the vulnerable library. Recommend a
base-image or build-tool update and a fresh final-image SBOM when the supplied
evidence does not prove the final image is clean. Do not suppress a finding
just because runtime exposure seems unlikely.

Never claim that a dependency was updated, an image was rebuilt, a finding
was closed, or a customer was contacted unless the input explicitly says that
it happened. Do not make repository or production changes. Do not include
secrets or reproduce tokens in the reply. Keep the customer response draft
clear enough for a security engineer to review before sending.

Use the OpenRouter model configured for this agent. I will select the Kimi K3
model identifier shown in my OpenRouter account.
```

Hermes will ask for the LLM credential during setup. In a separate Terminal, add the key through the local credential store:

```bash
printf '%s' "$OPENROUTER_API_KEY" | agentpaas secret add openrouter-key
```

When Hermes asks you to continue, tell it that `openrouter-key` is stored. Configure the agent to use `openrouter.ai`. Add the public research hosts from the incident packet to the agent's allowed HTTP destinations. The demo packet uses `nvd.nist.gov` and `oss-security.openwall.org`. If Hermes asks for a model identifier, select the Kimi K3 identifier shown in your OpenRouter account instead of guessing one.

### Step 3: Test with the complete packet locally

In Hermes, paste the full packet from the [finished demo message](#what-the-finished-demo-looks-like), including the `@incident-review` line and the JSON object. Then add:

```text
Run the CVE review using only the complete packet above. Do not use context
from any earlier message. Return all nine required headings and mark the
runtime exposure as conditional until the final image digest is verified.
```

Check that the response contains all nine headings, names the source status, and distinguishes the builder-layer finding from confirmed runtime exposure. If the agent says it fixed the dependency or contacted Northstar Payments, revise the prompt before moving to Cloud.

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
Pack this CVE review agent for AgentPaaS Cloud, run its checks, and push the
signed linux/amd64 package to the Cloud registry. Stop before deploying and
show me the package result.
```

When the package is ready, deploy it:

```text
Deploy the CVE review agent to my AgentPaaS Cloud tenant and show me the
deployment ID. Use the existing OpenRouter credential label openrouter-key,
declare openrouter.ai, nvd.nist.gov, and oss-security.openwall.org for the
HTTP requests, and stop after deployment.
```

The deployment receives a `dep_...` ID. Record it. The Cloud credential commands are:

```bash
agentpaas cloud secrets push openrouter-key
agentpaas cloud secrets bind dep_01J... openrouter-key --as bearer --host openrouter.ai
agentpaas cloud secrets bindings dep_01J...
```

The bindings command prints labels and destinations, never the key value. If the deployment ID or model identifier differs in your tenant, use the value Hermes reports.

### Step 6: Test the Cloud deployment before Slack

Mint a deployment invoke token in your Terminal. Store it locally and never paste it into Slack or Hermes:

```bash
agentpaas cloud invoke-token dep_01J...
```

Invoke the deployment with the exact complete JSON packet from the finished demo message. Put the packet in the `text` field of the JSON body:

```bash
agentpaas cloud invoke dep_01J... \
  --body '{"text":"<paste the complete incident packet here>","channel":"security-incident-review","trigger":"slack"}' \
  --wait
```

The `<paste the complete incident packet here>` text is the full packet shown above, including all fields and source URLs. Do not replace it with only `IR-2026-052` or a short question. Confirm that the Cloud result has all nine headings and that **Runs** and **Logs** show the execution.

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
/invite @incident-review
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
  --label "CISO CVE review Slack app" \
  --secret-stdin
```

Record the output:

```text
src_01J...
Request URL: https://cloud.agentpaas.ai/v1/hooks/src_01J...
```

One Slack app maps to one source. Create another source for another workspace or bot.

### Step 12: Connect the source to the deployment

Restrict this source to the review channel:

```bash
agentpaas cloud ingress connect src_01J... dep_01J... \
  --label "customer CVE review" \
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

### Step 14: Post the complete customer-call packet

In `#security-incident-review`, mention the bot and paste the entire packet from [What the finished demo looks like](#what-the-finished-demo-looks-like). The first line must mention the bot:

```text
@incident-review Analyze this customer security call. Treat the JSON packet below as the complete context for this run. Do not rely on earlier Slack messages.
```

Paste the full JSON object after that line. Do not send only the incident ID or the customer's question. The Slack message is the agent's complete input.

Expected behavior:

- Slack sends the signed event to the Request URL.
- AgentPaaS verifies the request and acknowledges Slack without waiting for the model analysis.
- The deployment receives the message text, including the complete packet.
- The agent researches the supplied public sources when its HTTP policy permits those hosts.
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

### Step 16: Run a second review with a complete packet

A short follow-up such as `@incident-review update this` has no prior context. Send the entire packet again with the new evidence included:

```text
@incident-review Reassess this customer security call using only the complete packet below. The new evidence is included in the packet. Do not rely on the earlier thread.

{
  "incident_id": "IR-2026-052",
  "customer": "Northstar Payments",
  "request": "The automated run shows a new critical CVE warning. Fix it before our next release.",
  "cve": "CVE-2024-3094",
  "scan": {
    "tool": "synthetic-sbom-scan",
    "image": "northstar/payments-api:2026.09.10",
    "finding": "xz-utils 5.6.1 in build layer builder-0",
    "final_image_contains_package": "verified absent",
    "runtime_linkage": "verified absent"
  },
  "repository": {
    "url": "https://github.com/example/northstar-payments-api",
    "commit": "8f31c2e",
    "sbom_excerpt": "runtime-0: no xz-utils package; runtime-0: no liblzma linkage",
    "new_build_evidence": "builder rebuilt with xz-utils 5.6.4; final image digest sha256:example; fresh SBOM attached"
  },
  "internal_architecture_excerpt": "The payments API runtime is a statically linked Go binary. The Debian builder layer is discarded. Release policy requires a fresh SBOM after a build-tool change.",
  "sources_to_check": [
    "https://nvd.nist.gov/vuln/detail/CVE-2024-3094",
    "https://www.openwall.com/lists/oss-security/2024/03/29/4"
  ],
  "questions": [
    "Can the security engineer tell the customer the final image is outside the affected runtime path?",
    "What evidence should be retained with the release record?"
  ]
}

Return the nine required headings and distinguish the new evidence from the original scan.
```

This second run demonstrates the review loop without pretending that the bot remembers the first run. The security engineer can decide whether to approve the release, request more evidence, or keep the customer issue open.

## What to show the CISO

Open the Cloud console after the Slack reply:

1. **Deployments**, show the CVE review agent deployment.
2. **Runs**, open the run created by the complete Slack packet.
3. **Logs**, show the model request and allowed research destinations.
4. **Ingress**, show the Slack source, active connection, channel filter, and recent event status.
5. **Secrets**, show the `openrouter-key` and `slack-bot-token` labels without opening values.

Explain the boundaries plainly:

- The Slack message is the complete context for each run.
- Slack authenticates the inbound event with its signing secret.
- AgentPaaS checks the provider signature before a run exists.
- The connection filter decides which deployment receives an admitted event.
- The OpenRouter key and Slack bot token stay in the credential broker.
- Public research is limited to the hosts declared for the deployment.
- The agent returns analysis and recommendations. It does not update dependencies, rebuild images, suppress findings, or contact the customer.
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

If the run appears but the analysis says the packet is missing, resend the complete JSON packet. A thread does not provide context to a new run.

If the analysis says it could not research a source, check that the deployment allows the source host and that the URL is reachable. The agent must say when a source was not fetched. It must not present an unverified source claim as a fetched result.

If the run appears but the thread stays empty, bind the `xoxb-` bot token with `slack-bot-token`, confirm the bot has `chat:write`, and check that the deployment returned text or an `answer` field.

If the model claims that the dependency was updated or the customer was contacted, return to Step 2 and strengthen the instruction that recommendations are not completed actions. Test again with synthetic evidence before posting another Slack event.

## Related

- [Ingress through the gateway](../trial/ingress)
- [Agent Guided Demo](../trial/guided-demo)
- [Cloud commands](../cli/cloud)
- [Credentials and secrets](../security/credentials)
- [Threat model](../security/threat-model)
- [Known limitations](../security/known-limitations)

Slack references: [The Slack Events API](https://api.slack.com/events-api) and [Verifying requests from Slack](https://api.slack.com/authentication/verifying-requests-from-slack).
