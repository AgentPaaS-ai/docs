---
id: athena-debugging
title: Debugging with Athena
sidebar_label: Debugging with Athena
---

# Debugging with Athena

Use Athena to inspect a failed or unexpected run from the cloud console. She looks up current tenant data, reports the fields that exist, and opens the relevant console page.

## Investigate the latest run

1. Ask for the latest run.

   ```text
   What was my last run?
   ```

   Athena checks the newest run and points you to `/runs?id=<run_id>`.

2. Ask what failed recently.

   ```text
   What failed recently?
   ```

   Athena checks the failure metric and the newest failed run. She reports the total failure count when it is available.

3. Ask whether anything is still running.

   ```text
   Is anything running?
   ```

   Athena checks runs with a running status. She gives you the count and opens `/runs`, or opens the specific run when there is one.

4. Ask what ran on a recent day.

   ```text
   What ran yesterday?
   ```

   Athena uses run creation dates and America/Los_Angeles for the time zone. She opens `/runs`.

## Investigate a specific failure

Ask for the run ID when you have it:

```text
Why did run_abc fail?
```

Replace `run_abc` with the real run ID. Athena checks that run and reports its status, timestamps, deployment ID, and recorded error when those fields exist.

If the run did not fail, Athena says that it did not fail and reports its actual status. If the run cannot be found, Athena says so. She does not invent a failure reason or substitute another run.

Open the run record at `/runs?id=<run_id>`. Open `/audit` for execution and policy records.

## Check the surrounding resources

Run failures often involve the deployed component or workflow that handled the request. Ask:

```text
What deployment ran this?
```

```text
What workflows do I have?
```

```text
Where are my logs?
```

Athena can point you to deployments, workflows, runs, and audit records in your tenancy. Use the console to inspect those records. Use Hermes or the AgentPaaS CLI to make a change and run the test again.

## What Athena can see during debugging

Athena can read:

- Run ID and status.
- Creation and finish timestamps when present.
- Deployment ID.
- Recorded run error when present.
- Run counts and failure metrics.
- Deployment, workflow, component, audit, usage, and plan metadata.
- Secret names and binding metadata, never secret values.

Athena cannot read arbitrary files on your machine, inspect another tenant, browse the general internet, or change the run. Her read-only console token is enforced by the service.

## Console paths

- `/runs` shows runs.
- `/runs?id=<run_id>` shows one run.
- `/deployments` shows live component deployments.
- `/workflows` shows workflow recipes.
- `/components` shows registry components.
- `/audit` shows logs and audit records.
- `/plan` shows usage and plan information.

See [What Athena can do](./what-athena-can-do) for the security boundary and [What you can ask Athena](./athena-questions) for the full question map.
