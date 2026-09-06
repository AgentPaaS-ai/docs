# Runs and Audit Logs

Every invocation creates a run. AgentPaaS records what ran, which deployment handled it, whether policy allowed or denied an action, and what result the run produced. Use Runs and Logs together when you need to understand an execution.

## Runs

A run is one execution of a deployed agent, MCP server, tool, or workflow. The run has a run ID and a status. A workflow also has a workflow instance with stage progress and member runs.

Use the CLI to inspect a cloud run:

```bash
agentpaas cloud status RUN_ID_FROM_OUTPUT
agentpaas cloud result RUN_ID_FROM_OUTPUT
agentpaas cloud logs RUN_ID_FROM_OUTPUT
agentpaas cloud events RUN_ID_FROM_OUTPUT
```

Use the run ID returned by `agentpaas cloud invoke` or `agentpaas cloud run`. The cloud console shows the same execution under **Runs**.

## Logs

Logs show the execution and policy records for a run. Check them after an invocation to see the result path, allowed egress, denied egress, and relevant runtime events. Logs are not the same as the agent's ordinary stdout.

Query the records from the CLI:

```bash
agentpaas cloud logs RUN_ID_FROM_OUTPUT
agentpaas cloud audit export RUN_ID_FROM_OUTPUT
```

For local runs, use:

```bash
agentpaas logs RUN_ID_FROM_OUTPUT
agentpaas audit query --run-id RUN_ID_FROM_OUTPUT
```

## Audit evidence

Audit is the evidence trail for platform controls. It records policy decisions and execution metadata that connect a request to a deployment and run. The audit record does not expose secret values or OAuth access and refresh tokens.

For OAuth delegated access, audit metadata can show events such as consent required, consent granted, token refresh, token injection, scope violation, or revocation. It stores identifiers, scope names, and event details. It does not store the token values, client secret, client ID, or authorization code.

## Console review

The console is read-only. Use Hermes or the CLI to create, pack, push, deploy, and invoke. Use the console to review:

- **Components**, the admitted packages
- **Deployments**, the live component instances
- **Workflows**, the signed recipes
- **Runs**, the executions
- **Logs**, the execution and policy records

When a run fails, start with the run status, then read the result, logs, and events. If a workflow reports `deployment_not_found`, redeploy the missing member component before trying again.

See [AgentPaaS concepts](concepts.md), [Platform limits](platform-limits.md), and [Troubleshooting](troubleshooting.md).
