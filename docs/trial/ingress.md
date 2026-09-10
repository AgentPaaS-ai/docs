---
id: ingress
title: Ingress through the gateway
sidebar_label: Ingress
---

# Ingress through the gateway

Use ingress to let a third-party service start a governed run. AgentPaaS verifies the request signature, applies the connection filter, and sends the accepted event to a deployed agent. The request URL is a source. Each source can connect to one or more deployments.

Ingress is the inbound side of the gateway topic. It admits an external event into a run. The gateway still controls the run's outbound HTTP and HTTPS requests, brokered credentials, and audit records. See [Gateway security controls](./gateway-security), the [threat model](../security/threat-model), and [Known limitations](../security/known-limitations).

## Prerequisites

- AgentPaaS CLI 0.4.1 or newer
- An AgentPaaS Cloud tenant session
- A deployed agent and its `dep_...` deployment ID
- A third-party app that can send HTTP POST requests and sign them with HMAC
- A signing secret, kept out of chat and shell history

## Supported providers

The Cloud ingress registry currently has these providers:

| Provider | Use it for | Signature and admission behavior |
|---|---|---|
| `slack` | Slack Events API | Verifies `X-Slack-Signature` with `X-Slack-Request-Timestamp`, accepts `url_verification`, and admits `app_mention` events only |
| `stripe` | Stripe webhooks | Verifies `Stripe-Signature` in `t=...,v1=...` form and admits JSON objects |
| `github` | GitHub webhooks | Verifies `X-Hub-Signature-256`, uses `X-GitHub-Delivery` for deduplication, and admits JSON objects |
| `generic_hmac` | Other services with a compatible signer | Verifies `X-Agentpaas-Signature: t=<unix_seconds>,v1=<64 hex>` over `t.raw_body` and admits JSON objects |

`generic_hmac` is the integration path for systems that can calculate an HMAC-SHA256 signature over the exact raw request body. Send the signature in lowercase hexadecimal. The timestamp must be within 300 seconds of the Cloud clock. Supply `Idempotency-Key`, `X-Agentpaas-Idempotency-Key`, or a body `idempotency_key` when the sender does not have a provider event ID.

Provider names are exact. An unknown provider returns HTTP `400` with `{"error":"unknown_provider"}`.

## Create a source

1. Log in to Cloud.

```bash
agentpaas cloud login
agentpaas cloud whoami
```

2. Create a source. The command prints the source ID and the Request URL. It does not print the signing secret.

```bash
printf '%s' "$INGRESS_SIGNING_SECRET" | agentpaas cloud ingress source create \
  --provider generic_hmac \
  --label "billing-events" \
  --secret-stdin
```

Example output:

```text
src_01J...
Request URL: https://cloud.agentpaas.ai/v1/hooks/src_01J...
```

Use the same command with `--provider slack`, `--provider stripe`, or `--provider github` when the sender uses that provider's signature format.

3. Connect the source to a deployment.

```bash
agentpaas cloud ingress connect src_01J... dep_01J... \
  --label "start billing agent"
```

With no `--filter`, every event admitted by the provider is sent to the deployment. One source can have multiple connections, each with its own deployment and filter.

## Filter events

Filters use dotted field paths and are evaluated against the provider's received event object. Use `match: "all"` or `match: "any"`. Supported operators are `eq`, `ne`, `in`, `contains`, `starts_with`, and `exists`.

For example, limit a Slack source to one channel:

```bash
agentpaas cloud ingress connect src_01J... dep_01J... \
  --label "support channel" \
  --filter '{"match":"all","rules":[{"field":"event.channel","op":"eq","value":"C0123"}]}'
```

For a Slack source, useful filter paths include `event.channel`, `event.user`, and `event.text`. The provider still rejects Slack events other than `event_callback` with an inner `app_mention`, even when a filter would otherwise match them.

Test a filter before relying on it:

```bash
agentpaas cloud ingress test-filter src_01J... \
  --filter '{"match":"all","rules":[{"field":"event.channel","op":"eq","value":"C0123"}]}' \
  --event '{"type":"event_callback","event":{"type":"app_mention","channel":"C0123","text":"hello"}}'
```

Expected output:

```text
matched=true
```

A malformed filter produces `cloud ingress connect: --filter must be JSON` in the CLI. The API returns `filter_json is invalid` when the filter shape or operator is invalid.

The filter test endpoint is separate from connection creation. Its API shape is:

```text
POST /v1/ingress/test-filter
{"filter":{"match":"all","rules":[]},"event":{}}
```

It returns `{"matched":true}` or `{"matched":false}`. An invalid test filter returns `filter is invalid`.

## Integrate with Slack

Slack sends Events API POST requests to the source Request URL. AgentPaaS verifies the Slack signature before a run exists. It accepts Slack's `url_verification` challenge and returns the challenge string, so you can paste the Request URL into Slack's Event Subscriptions page.

1. Create or open a Slack app for the workspace.

2. In **Basic Information**, copy the app's **Signing Secret**. Keep it in an environment variable.

```bash
export SLACK_SIGNING_SECRET='replace-with-the-signing-secret'
```

3. Create the Slack ingress source.

```bash
printf '%s' "$SLACK_SIGNING_SECRET" | agentpaas cloud ingress source create \
  --provider slack \
  --label "support bot" \
  --secret-stdin
```

Copy the printed `Request URL`.

4. In the Slack app, open **Event Subscriptions**, turn on **Enable Events**, and paste the Request URL into **Request URL**.

5. Add the bot event `app_mention` under **Subscribe to bot events**.

6. Install or reinstall the app in the workspace, then invite the bot to the channel where it should receive mentions.

7. Connect the Slack source to the deployment. This example limits the agent to channel `C0123`.

```bash
agentpaas cloud ingress connect src_01J... dep_01J... \
  --label "reply to support mentions" \
  --filter '{"match":"all","rules":[{"field":"event.channel","op":"eq","value":"C0123"}]}'
```

8. Mention the bot in that channel. AgentPaaS maps the event into the run payload:

```json
{
  "text": "hello there",
  "channel": "C0123",
  "thread_ts": "1710000000.000100",
  "user": "U123",
  "team_id": "T123",
  "event_id": "Ev123",
  "trigger": "slack"
}
```

The leading bot mention is removed from `text`. `thread_ts` uses the event's thread timestamp and falls back to the event timestamp, so a reply can stay in the originating thread.

### Enable replies in Slack

Ingress can start a run without a reply credential. To have AgentPaaS post the final output back to the originating Slack thread, bind the Slack bot token to the source.

The token must begin with `xoxb-`. The only accepted reply credential name is `slack-bot-token`.

```bash
export SLACK_BOT_TOKEN='xoxb-replace-with-the-bot-token'
printf '%s' "$SLACK_BOT_TOKEN" | agentpaas cloud ingress source bind-reply src_01J... \
  --credential slack-bot-token \
  --secret-stdin
```

The bot needs permission to post messages. Slack replies use `chat.postMessage` and the pinned source channel and thread. Agent output cannot select a different destination. Output is limited to 4,000 characters.

### Slack changes you can request from Hermes or the CLI

Ask Hermes to run the matching CLI command, or run it yourself:

| Change | Command or setting |
|---|---|
| Create a Slack source | `agentpaas cloud ingress source create --provider slack --label "support bot" --secret-stdin` |
| Attach or replace the signing secret | `agentpaas cloud ingress source rotate src_01J... --secret-stdin` |
| Connect another deployment | `agentpaas cloud ingress connect src_01J... dep_01J... --label "triage"` |
| Restrict by channel, user, text, or another event field | `agentpaas cloud ingress connect ... --filter '<JSON>'` |
| Test a filter without sending a Slack event | `agentpaas cloud ingress test-filter src_01J... --filter '<JSON>' --event '<JSON>'` |
| Prevent the bot from responding to its own mentions | `agentpaas cloud ingress source bind-reply src_01J... --credential slack-bot-token --secret-stdin`, with optional `bot_user_id` set through the API |
| Enable thread replies | Bind `slack-bot-token`; the source records `thread_ts` from the accepted event |
| Pause all connections from the source | `agentpaas cloud ingress source disable src_01J...` |
| Pause one deployment subscription | `agentpaas cloud ingress connection disable con_01J...` |
| Inspect recent events and match status | `agentpaas cloud ingress events src_01J... --tail 20` |
| Inspect connections and filters | `agentpaas cloud ingress connections src_01J...` |

The CLI does not expose a `--bot-user-id` flag. If you need explicit self-filtering, ask Hermes to call the Cloud API with `bot_user_id` in the bind-reply request, or use the API directly with the tenant session. The API field must be a non-empty string. The Slack adapter already drops events with a `bot_id` field.

The API request is:

```text
POST /v1/ingress/sources/src_01J.../bind-reply
{"credential":"slack-bot-token","secret":"xoxb-replace-with-the-bot-token","bot_user_id":"U0BOT"}
```

The API returns `bot_user_id must be a non-empty string` for an empty value. It returns `credential must be slack-bot-token` for another credential name and `secret must be a Slack bot token` when the supplied token does not begin with `xoxb-`.

The Slack adapter admits `app_mention` only. It does not turn ordinary `message`, `reaction_added`, or other Slack event types into runs.

## Operate and troubleshoot

List sources:

```bash
agentpaas cloud ingress sources
```

Show recent events, including `admitted`, `filtered`, and `duplicate` status:

```bash
agentpaas cloud ingress events src_01J... --tail 20
```

If you see HTTP `401` from the Request URL, the signature is missing, invalid, or older than 300 seconds. Check the provider secret, the raw body used for signing, the provider header, and the sender clock.

The ingress API reports `signature_required` for a missing signature and `unauthorized` for a signature that fails verification. Slack, Stripe, and `generic_hmac` reject signatures older than 300 seconds. GitHub verifies the HMAC without a timestamp window.

If a Slack event returns a successful HTTP response and no run appears, check that Slack sent an `app_mention`, that the bot is in the channel, and that the connection filter matches `event.channel`. Use `agentpaas cloud ingress events src_01J... --tail 20` to see whether the event was `filtered`.

If a reply does not appear, verify the source has a bound `slack-bot-token`, the token starts with `xoxb-`, the bot can post in the channel, and the deployment returned text or an `answer` field. Replies use Slack over HTTPS through the Cloud gateway path.

If you see `cloud ingress source bind-reply: --credential is required`, add `--credential slack-bot-token`. If you see `secret must be a Slack bot token`, pass the bot token rather than the signing secret.

Ingress uses the same per-deployment invoke limit as CLI invocation. A valid signature and matching filter do not create a separate budget. Request bodies are bounded before payload persistence. Read [Known limitations](../security/known-limitations) before making isolation or delivery guarantees.

## Related pages

- [Gateway overview](./gateway)
- [Gateway security controls](./gateway-security)
- [Cloud commands](../cli/cloud)
- [Threat model](../security/threat-model)
- [Known limitations](../security/known-limitations)

Slack references: [The Slack Events API](https://api.slack.com/events-api) and [Slack signing secrets](https://api.slack.com/authentication/verifying-requests-from-slack).
