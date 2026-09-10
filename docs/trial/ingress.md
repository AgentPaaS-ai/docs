---
id: ingress
title: Ingress
sidebar_label: Ingress
---

After this page, you can connect one Slack app to an AgentPaaS agent, route
mentions to that agent, and have the agent reply in the Slack thread.

Ingress has two parts:

- A source is one external app and its Request URL. A Slack app is one source.
- A connection says which deployed agent wakes when that source receives an
  event.

Hermes can set this up for you. Tell Hermes which Slack app to connect, which
agent should wake, and which channel or event the connection should accept.

## Before you start

- Have a Slack app with its HTTP Events settings available.
- Have a deployed AgentPaaS agent and its deployment name or ID.
- Have the Slack signing secret ready for the source.
- Have the Slack bot token ready if the agent must reply in a thread.

## Connect one Slack app

1. Ask Hermes to create an ingress source for the Slack app.

   Hermes creates one source and returns one Request URL. The cloud inbound
   URL has this form after this cut:

   ```text
   https://cloud.agentpaas.ai/v1/hooks/src_01J...
   ```

2. In the Slack app settings, turn Socket Mode off.

3. Open the HTTP Events settings in Slack.

4. Paste the returned URL into Slack's Request URL field.

5. Enable the event subscription in Slack.

There is one Request URL for this source. The source receives the app's
events, verifies them, and passes accepted events to its connections.

## Choose the agent that wakes

Ask Hermes to connect the source to a deployed agent. This creates a
connection. Give the connection a label and, when needed, a filter such as a
Slack channel. The connection determines which agent wakes for the event.

One source can have more than one connection. For example, one Slack app can
send a support-channel mention to a support agent and an unfiltered copy to an
analytics agent.

## Mention, acknowledgement, and reply

The request path is:

1. Someone mentions the bot in Slack.
2. AgentPaaS acknowledges the Slack request within 3 seconds.
3. The matching connection starts the agent run.
4. The configured reply credential lets the agent reply in the Slack thread.

Bind the Slack bot token to the source when replies are required. Keep the
token in the CLI secret input or the credential store. AgentPaaS does not print
the token in command output or source details.

## Deploy updates

Deploying a new version of the same agent does not require a new Slack Request
URL. The connection follows the new deployment of that agent name.

The old deployment keeps its pad until you undeploy it. AgentPaaS does not
auto-undeploy old deployments. If you no longer need the old pad, undeploy it
yourself. Deploying X does not delete Y, and your trial slot count includes
the old deployment until you remove it.

## Two Slack bots

Two Slack bots require two sources. Each source has its own Slack app, signing
secret, and Request URL. Create a connection for each source and select the
agent that should wake for that bot.

## Limitations and security

- Socket Mode is not an AgentPaaS ingress path. Use Slack HTTP Events with the
  Request URL.
- The console shows ingress state. Hermes or the AgentPaaS CLI performs writes.
- Read [Known limitations](../security/known-limitations) before making
  isolation or long-running-run assumptions.
- Read the [threat model](../security/threat-model) for the security boundary
  and credential handling details.

For the exact CLI commands, see [Cloud commands](../cli/cloud).