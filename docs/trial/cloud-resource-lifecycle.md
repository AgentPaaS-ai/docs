---
id: cloud-resource-lifecycle
slug: /trial/cloud-resource-lifecycle
title: Delete cloud resources safely
sidebar_label: Delete cloud resources
---

# Delete cloud resources safely

Use this runbook when you need to remove a deployed agent, MCP server, tool, workflow, ingress source, secret, or admitted image from AgentPaaS Cloud. It gives you a dependency order that avoids leaving ingress traffic pointed at a deleted deployment or an image referenced by a workflow.

## Before you start

- Install AgentPaaS CLI 0.5.0 or newer.
- Log in with access to the tenant that owns the resources.
- Run the commands in your own Terminal. Destructive cloud commands require an explicit confirmation.

```bash
agentpaas version
agentpaas cloud login
agentpaas cloud whoami
```

The console is useful for inspection. Use the CLI for lifecycle changes.

## The deletion order

For a deployed agent, MCP server, or tool, use this order:

1. Disable its cron schedule.
2. Remove every ingress connection that targets the deployment.
3. Wait for running copies to finish, or cancel the runs.
4. Undeploy the component.
5. Remove secrets that are no longer needed.
6. Delete the admitted image after every deployment and workflow reference is gone.

A workflow has a different lifecycle. Retire the workflow recipe after its running instances are terminal, then clean up its child component deployments with the order above. A workflow is a stored recipe. It does not have a deployment to undeploy.

## 1. Inventory the resources

List the deployments, images, workflows, and ingress sources before changing anything.

```bash
agentpaas cloud deployments
agentpaas cloud images
agentpaas cloud workflow list
agentpaas cloud ingress sources
```

For each ingress source, list its connections. Set the IDs from the previous command output.

```bash
SOURCE_ID="src_01JEXAMPLE000000000000000000"
agentpaas cloud ingress connections "$SOURCE_ID"
```

Use `--json` when an agent or script parses the result.

```bash
agentpaas --json cloud deployments
agentpaas --json cloud images
agentpaas --json cloud workflow list
agentpaas --json cloud ingress sources
```

Record every connection whose deployment id matches the component you plan to remove. Also record any workflow that uses that component's image digest.

## 2. Disable scheduled invocations

A cron schedule is stored on the deployment. Disable it before cleanup so a new scheduled run does not start while you are removing the component.

```bash
DEPLOYMENT_ID="dep_01JEXAMPLE000000000000000000"
agentpaas cloud cron disable "$DEPLOYMENT_ID"
```

Disabling keeps the stored schedule. That is useful when you are pausing a deployment. An undeploy removes the deployment, so the schedule cannot invoke that deployment after deletion.

## 3. Remove ingress connections first

This is the required ingress cleanup step. Undeploying a deployment does not remove its ingress connections. An active source can otherwise continue trying to start work for a deployment that no longer exists.

List each source's connections and disable every connection targeting the deployment.

```bash
SOURCE_ID="src_01JEXAMPLE000000000000000000"
CONNECTION_ID="con_01JEXAMPLE000000000000000000"
agentpaas cloud ingress connections "$SOURCE_ID"
agentpaas cloud ingress connection disable "$CONNECTION_ID"
```

There is no per-connection delete command in CLI 0.5.0. Disabling a connection stops it from matching new events, and the disabled connection is removed when its ingress source is deleted.

If the source is dedicated to the deployment, delete it after all of its connections are disabled.

```bash
SOURCE_ID="src_01JEXAMPLE000000000000000000"
agentpaas cloud ingress source delete "$SOURCE_ID" --yes --confirm-id "$SOURCE_ID"
```

Source deletion removes the source and its disabled connections. It does not disable active connections automatically.

If the source is shared with another deployment, keep the source. Disable only the connections for the deployment being removed. Do not delete the shared source unless you intend to remove every disabled connection and stop ingress for the other subscribers too.

If you see `source_in_use`, the source still has an active connection. Run `agentpaas cloud ingress connections "$SOURCE_ID"`, disable every active connection, and retry. The delete command prints the connection IDs that block it.

## 4. Finish running work

Inspect the tenant's Runs page in the Cloud console and note any run IDs that belong to the deployment. The console is read-only, so use the CLI for cancellation.

```bash
RUN_ID="run_01JEXAMPLE000000000000000000"
agentpaas cloud status "$RUN_ID"
agentpaas cloud cancel "$RUN_ID"
```

If the deployment is a workflow stage, inspect the workflow instance as well. For live-call children, hang them up before retiring the workflow.

```bash
INSTANCE_ID="wfi_01JEXAMPLE000000000000000000"
agentpaas cloud workflow instance "$INSTANCE_ID"
agentpaas cloud workflow hangup "$INSTANCE_ID"
```

Wait for cancelled work to reach a terminal state before trying undeploy or workflow retirement.

## 5. Undeploy the component

Agents, MCP servers, and tools use deployments. Undeploy deletes the live deployment, removes its secret bindings, and frees its deployment slot.

```bash
DEPLOYMENT_ID="dep_01JEXAMPLE000000000000000000"
agentpaas cloud undeploy "$DEPLOYMENT_ID" --yes --confirm-id "$DEPLOYMENT_ID"
```

Destructive confirmation works as follows:

- `--yes` is required, including with `--json`.
- In a non-TTY, `--confirm-id` must exactly match the deployment ID.
- In a TTY, the CLI asks you to type the deployment ID, even when `--yes` is present.

If you see `deployment_has_running_copies`, a run is still starting, running, or waiting for a seat. Inspect and cancel the run, wait for the status to become terminal, then retry. There is no `--force` flag for undeploy.

## 6. Retire a workflow

A workflow is a stored recipe. Retire it after its active instances are terminal.

```bash
WORKFLOW_ID="wf_01JEXAMPLE000000000000000000"
agentpaas cloud workflow retire "$WORKFLOW_ID" --yes --confirm-id "$WORKFLOW_ID"
```

Retire calls `POST /v1/workflows/:id/retire` and changes the workflow status to `disabled`. It does not delete workflow instance records or delete child component deployments.

If you see `workflow_in_use`, inspect the instance IDs printed by the CLI. Finish the instance, cancel its runs, or hang up its live-call children, then retry. The command has the same `--yes` and `--confirm-id` confirmation rules as undeploy.

After retiring the workflow, undeploy each child agent, MCP server, or tool that you no longer need. Remove that component's ingress connections before each undeploy.

## 7. Remove cloud secrets

List bindings before deleting a secret.

```bash
SECRET_NAME="openrouter"
DEPLOYMENT_ID="dep_01JEXAMPLE000000000000000000"
agentpaas cloud secrets bindings "$DEPLOYMENT_ID"
agentpaas cloud secrets delete "$SECRET_NAME" --yes --confirm-id "$SECRET_NAME"
```

If the secret is still bound, deletion returns HTTP 409 and prints the bound deployment IDs. CLI 0.5.0 has no standalone unbind command. Undeploy those deployments, which removes their bindings, then retry. Pass `--force` only when you intend to delete a still-bound secret.

```bash
SECRET_NAME="openrouter"
agentpaas cloud secrets delete "$SECRET_NAME" --yes --confirm-id "$SECRET_NAME" --force
```

Secret deletion removes the cloud secret label and its stored value. Secret values never appear in CLI output.

## 8. Delete the admitted image

Delete the image only after all deployments and workflow references to its digest are gone.

```bash
IMAGE_ID_OR_DIGEST="img_01JEXAMPLE000000000000000000"
agentpaas cloud images delete "$IMAGE_ID_OR_DIGEST" --yes --confirm-id "$IMAGE_ID_OR_DIGEST"
```

You can pass an image ID or a `sha256:` digest. Image deletion does not undeploy anything.

If you see HTTP 409 or `image_in_use`, inspect the blocker list. A deployment blocker requires `agentpaas cloud undeploy <dep_id>`. A workflow blocker requires retiring the workflow that contains the image digest. The image delete command prints undeploy commands for blocking deployments. Check `agentpaas cloud workflow list` and `agentpaas cloud workflow get "$WORKFLOW_ID"` for workflow references.

Image deletion removes the admitted registry record. Keep a local project or signed package if you need to rebuild the component later.

## Confirmation and automation rules

All of these operations require a valid cloud login and explicit confirmation:

```text
agentpaas cloud undeploy <dep_id> --yes --confirm-id <dep_id>
agentpaas cloud images delete <img_id_or_sha256> --yes --confirm-id <img_id_or_sha256>
agentpaas cloud secrets delete <name> --yes --confirm-id <name>
agentpaas cloud workflow retire <wf_id> --yes --confirm-id <wf_id>
agentpaas cloud ingress source delete <src_id> --yes --confirm-id <src_id>
```

Replace each placeholder with the exact value from your tenant. `--json` changes output format. It does not bypass confirmation. Keep destructive calls in a human-controlled terminal, not inside an unattended agent loop.

## When cleanup gets stuck

If a command returns HTTP 409, read the resource-specific blocker information in the error and resolve that dependency first. Do not repeat the same delete command without changing the dependency state.

- `source_in_use`: disable every active connection for the source, then retry source deletion.
- `deployment_has_running_copies`: inspect and cancel the active or pending runs, wait for terminal status, then retry undeploy.
- `workflow_in_use`: finish or cancel active workflow work and hang up live-call children, then retry retirement.
- `image_in_use`: undeploy every deployment using the image and retire any workflow that still references its digest.
- `confirmation failed (run this in your own terminal, not via an agent)`: run the command in your own Terminal with `--yes` and an exact `--confirm-id` when stdin is non-TTY. In a TTY, type the exact value at the prompt.
- `not logged in`: run `agentpaas cloud login`, complete the browser flow in the same browser used for the trial claim, and retry.

A deleted deployment's workflow reference remains stored. If a later workflow run reports `deployment_not_found`, redeploy the missing component and restore its secret bindings, or retire the workflow if it is no longer needed.

See [Cloud commands](../cli/cloud), [Ingress through the gateway](./ingress), and [Platform limits](./platform-limits) for the command reference, ingress behavior, and deployment limits.
