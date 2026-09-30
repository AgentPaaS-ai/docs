---
id: workflow-waiting
title: Workflow waiting and capacity
sidebar_label: Waiting and capacity
---

# Workflow waiting and capacity

You can run a workflow child call without keeping the incoming HTTP request open while Cloud waits for a copy slot. This applies to live child calls that are temporarily blocked by runtime capacity.

## What happens

1. The parent workflow requests a child invocation.
2. Cloud finds that the assigned runtime has no available copy slot.
3. Cloud records the child run with status `waiting_seat`.
4. Cloud returns HTTP `202` with the child run ID and a mailbox token.

```json
{
  "mailbox_token": "…",
  "run_id": "…",
  "code": "waiting_seat"
}
```

Cloud retries admission in the background. The default wait is 10 minutes, with checks every 10 seconds. When a slot opens, Cloud starts the child, writes its result to the mailbox, and resumes the parent workflow.

A waiting child does not count as `starting` or `running`. The wait does not consume a copy slot.

## Mailbox results

The mailbox is scoped to the tenant and can be consumed once.

| Response | Meaning |
|---|---|
| `204` | The child is still waiting. |
| `200` | The child finished. The response contains its result. |
| `404` | The token is missing, invalid, or already consumed. |

The workflow does not continue as if the child succeeded when the wait expires. The relevant failure is one of these exact errors:

```text
seat_wait_timeout
live_call_wait_expired
```

`seat_wait_timeout` means the child waited for capacity longer than the configured seat wait. `live_call_wait_expired` means the parent workflow's own time budget ended first.

## Customer impact

This behavior handles temporary concurrency pressure. It prevents a whole parent workflow from failing immediately when its child cannot start, and it prevents Cloud from holding an HTTP request open during the wait.

This is not a general pause, delay, or human approval step. It applies to live child calls waiting for a runtime copy slot.

See [Platform limits](./platform-limits) for capacity limits and [Workflows](./workflows) for the authoring path.
