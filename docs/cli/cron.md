---
id: cron
title: Cron (local and cloud)
sidebar_label: Cron
---

## Local

Local schedules use standard **5-field** cron (and optional timezone), same idea as macOS/cron:

```bash
agentpaas cron add weather --expr "0 */6 * * *"
agentpaas cron add weather --expr "30 9 * * 1-5" --timezone America/New_York
agentpaas cron list
agentpaas cron remove <schedule-id>
```

Fields: `minute hour day-of-month month day-of-week`.

## Cloud

Cloud accepts:

1. **Named intervals:** `every_1m`, `every_5m`, `every_15m`, `every_1h`
2. **Standard 5-field cron in UTC**, for day/time schedules

```bash
# every 5 minutes
agentpaas cloud cron set <deployment> --expr every_5m

# 09:30 UTC, Monday-Friday
agentpaas cloud cron set <deployment> --expr "30 9 * * 1-5"

# midnight UTC on the 1st of each month
agentpaas cloud cron set <deployment> --expr "0 0 1 * *"

# every 15 minutes
agentpaas cloud cron set <deployment> --expr "*/15 * * * *"

agentpaas cloud cron list
agentpaas cloud cron disable <deployment>
agentpaas cloud cron enable <deployment>
```

`<deployment>` may be a `dep_…` id or unique agent name.

Cloud schedules are evaluated in **UTC**. Convert your local wall clock to UTC when setting five-field expressions (for example Pacific 09:30 is often `30 16` or `30 17` UTC depending on DST).

The cloud console Cron tab is **read-only**; change schedules via CLI or Hermes tools that call these verbs.
