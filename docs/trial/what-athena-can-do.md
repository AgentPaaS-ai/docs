---
id: what-athena-can-do
title: What Athena can do
sidebar_label: Overview
---

# What Athena can do

Athena is the read-only assistant for your AgentPaaS Cloud tenancy. She answers AgentPaaS questions, inspects your tenant's components and runs, explains console records, and points you to the relevant page.

Use Athena when you need help with AgentPaaS or when a run needs investigation. Build, deploy, invoke, and change resources with Hermes or the AgentPaaS CLI. Athena does not perform those actions.

## Athena's security boundary

Athena has a separate instance for your tenancy. She can see your tenancy only. She can see secret names and bindings, never secret values.

Athena is built like any other AgentPaaS agent. Her container uses the same default-deny network topology and gateway sidecar for egress. The gateway allows the AgentPaaS API and the configured model endpoint. Athena cannot browse the general internet.

Athena does not receive secret values. The values stay outside the agent process. Her console-read token grants read access to this tenancy and does not grant permission to deploy, invoke, delete, or change resources.

## What Athena cannot do

Athena is read-only. Read-only access is enforced by the console-read token, not by a prompt instruction.

She cannot:

- Deploy, undeploy, invoke, or delete a resource.
- Create, edit, or delete a cloud schedule.
- Write or rotate secrets.
- Change a workflow, component, deployment, policy, or tenant setting.
- See another tenant.
- Fetch the general internet.
- Provide general coding help, news, competitor information, weather, or other off-product answers.

How-to questions about schedules, secrets, tokens, and other AgentPaaS operations are supported. Athena explains the documented procedure and leaves the action to Hermes or the CLI.

## Sessions and memory

Athena sleeps after two minutes of inactivity and wakes when you send another message. Her instance belongs to your tenancy and is not shared with another customer.

Athena can remember preferences per user when memory is enabled for the session. Clear saved preferences in **Settings**, **Athena**.

## Start here

- [What you can ask Athena](./athena-questions)
- [Debugging with Athena](./athena-debugging)
- [AgentPaaS concepts](./concepts)
- [Dashboard tour](./dashboard-tour)
