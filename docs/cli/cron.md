---
id: cron
title: Cron (local and cloud)
sidebar_label: Cron
---

## Local

```bash
agentpaas cron --help
```

Manage local schedules for agent invocations (see `agentpaas cron --help` for verbs on your installed version).

## Cloud

Named intervals only: `every_1m`, `every_5m`, `every_15m`, `every_1h`.

```bash
agentpaas cloud cron set <deployment> --expr every_5m
agentpaas cloud cron list
agentpaas cloud cron disable <deployment>
agentpaas cloud cron enable <deployment>
```

`<deployment>` may be a `dep_…` id or unique agent name.

The cloud console Cron tab is **read-only**; change schedules via CLI (or Hermes tools that call these verbs).
