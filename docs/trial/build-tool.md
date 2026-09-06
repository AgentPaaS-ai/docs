# Build a tool

> **Use Hermes for the whole flow:** Ask Hermes to build a tool and it can run the AgentPaaS CLI commands for packing, pushing, deploying, and invoking it. You still approve cloud login in your browser and enter private credentials in your Terminal when prompted.

A tool is a small service that performs one declared operation. In AgentPaaS, a tool runs as a microservice in its own container. It has its own package, deployment, egress policy, secret bindings, and run records.

## Build the tool locally

In Hermes, describe one operation and its limits:

```text
Build a tool service that converts a temperature between Celsius and Fahrenheit. Validate the input schema, return a structured result, and keep the service limited to this operation.
```

Keep the tool independent from the workflow that calls it. The tool should validate its input, return a clear result, and reject unknown or malformed fields.

## Test the tool locally

Start the daemon, pack the tool project, and run it:

```bash
agentpaas daemon start
agentpaas pack ./temperature-tool
agentpaas run ./temperature-tool
agentpaas status
```

Test a valid request and an invalid request. Confirm that the tool returns the expected structured result and rejects the invalid input. Inspect the run:

```bash
agentpaas logs RUN_ID_FROM_OUTPUT
agentpaas audit query --run-id RUN_ID_FROM_OUTPUT
```

## Push and deploy the tool

Pack for the cloud, push the package, and deploy it with the tool kind:

```bash
agentpaas pack ./temperature-tool --target linux/amd64
agentpaas cloud push --lock "$HOME/.agentpaas/state/agents/temperature-tool/agent.lock"
agentpaas cloud images
agentpaas cloud deploy latest --type tool
agentpaas cloud deployments
```

The deployment receives a `dep_...` ID. Bind only the secrets and hosts the tool needs.

## Invoke and test the tool in Cloud

Create an invoke token and call the deployment with a JSON body that matches the tool's input schema:

```bash
agentpaas cloud invoke-token dep_EXAMPLE
export AGENTPAAS_CLOUD_INVOKE_TOKEN='inv_EXAMPLE'
agentpaas cloud invoke dep_EXAMPLE --body '{"celsius":20}' --wait
```

Inspect the cloud result and records:

```bash
agentpaas cloud result RUN_ID_FROM_OUTPUT
agentpaas cloud logs RUN_ID_FROM_OUTPUT
agentpaas cloud audit export RUN_ID_FROM_OUTPUT
```

Replace `dep_EXAMPLE` and `RUN_ID_FROM_OUTPUT` with values from your tenant. Check **Components**, **Deployments**, **Runs**, and **Logs** in the console.

## Use the tool in a workflow

Compose the workflow from the deployed tool ID and any other deployed component IDs. Push the signed workflow definition to the cloud, start it, then inspect the workflow run. A call to a tool that the signed workflow does not declare fails closed.

See [Tools](tools.md), [Workflows](workflow-kinds-and-edges.md), and [Runs and Audit Logs](runs-audit-logs.md).
