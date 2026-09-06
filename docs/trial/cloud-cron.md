# Cloud cron

Set a schedule on a deployed agent. Cron starts an agent run; it does not create a workflow.

```bash
agentpaas cloud cron set <deployment-id> --expr every_5m
agentpaas cloud cron list
agentpaas cloud cron disable <deployment-id>
agentpaas cloud cron enable <deployment-id>
```

Supported expressions exposed by the plugin are `every_1m`, `every_5m`, `every_15m`, and `every_1h`.
