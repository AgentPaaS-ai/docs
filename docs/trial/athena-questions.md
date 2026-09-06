---
id: athena-questions
title: What you can ask Athena
sidebar_label: Questions and capabilities
---

# What you can ask Athena

Athena answers questions about AgentPaaS and your own cloud tenancy. She reads live tenant records for inventory and run questions. She reads the live documentation for AgentPaaS how-to questions.

## Identity and capabilities

Ask:

- Who are you?
- What can you do?
- What is AgentPaaS?

Athena explains what she is, what she can read, and where the AgentPaaS documentation lives.

## Build and use AgentPaaS

Ask Athena for guidance with:

- Building, running, or deploying an agent.
- Building, starting, or running a workflow.
- Invoking an agent in the cloud.
- Setting up a cloud schedule.
- Adding and binding a secret.
- Creating an invocation token.
- Finding logs and the signed audit trail.
- Understanding a new release.

For these questions, Athena reads the matching live documentation page and links to it. She can guide you to the [Agent Guided Demo](./guided-demo), [workflow guide](./workflows), [cloud commands](../cli/cloud), [cron commands](../cli/cron), [secret commands](../cli/secrets), [invocation tokens](../cli/invoke-tokens), or [audit and lineage](../cli/audit-lineage).

Ask Athena to explain the procedure. Use Hermes or the CLI to carry it out.

## Inspect your tenancy

Ask:

- What was my last run?
- What failed recently?
- Why did this run fail?
- Is anything running?
- What ran yesterday?
- What do I have?
- What components, deployments, or workflows do I have?
- How much trial have I used?
- How much trial is left?
- How many days are left?
- Where are my logs?
- Where is the signed audit trail?

Athena reads the current tenant records before answering. She uses the time zone America/Los_Angeles for run times. When a console page helps, the last line of the response opens that page in the console.

## Usage and plan questions

Ask:

```text
How much trial do I have left?
```

```text
How many days are left?
```

Athena can report days remaining, CPU minutes, deployment limits, agent limits, and concurrency limits when those values are available in the live plan and usage records. She points you to `/plan` for the full view.

## Inventory questions

Ask:

```text
What deployments do I have?
```

```text
What workflows do I have?
```

```text
What components do I have?
```

Athena reports counts or a short answer instead of dumping every ID. She points you to `/components`, `/deployments`, or `/workflows`.

## Supported boundaries

Athena answers questions about your tenancy and AgentPaaS, including the AgentPaaS website, cloud console, CLI, SDK, security model, workflows, releases, and documented operations.

She refuses requests for general knowledge, competitor information, news, unrelated coding help, or other off-product topics. She also refuses requests to perform changes. See [Athena](./what-athena-can-do) for the security boundary and [Debugging with Athena](./athena-debugging) for run investigation.
