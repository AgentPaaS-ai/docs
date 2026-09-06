# Build an agent

> **Use Hermes for the whole flow:** Ask Hermes to build an agent and it can run the AgentPaaS CLI commands for packing, pushing, deploying, and invoking it. You still approve cloud login in your browser and enter private credentials in your Terminal when prompted.

Build the agent locally first. Hermes helps you write the project, test the behavior, and inspect the policy before anything runs in AgentPaaS Cloud.

## Build locally in Hermes

In Hermes, describe the job and the boundaries it needs:

```text
Build a weather agent. It should answer weather questions, use the approved weather API, and keep credentials out of the agent code.
```

Test the agent with ordinary and edge-case inputs. Check that it refuses work outside its declared purpose and that it does not receive raw credentials.

## Pack and check the agent

Run the local daemon, then pack and test the project:

```bash
agentpaas daemon start
agentpaas pack ./weather-agent
agentpaas run ./weather-agent
agentpaas status
```

For a cloud image, pack for `linux/amd64`:

```bash
agentpaas pack ./weather-agent --target linux/amd64
```

Inspect the local run before pushing it. Use the run ID from `agentpaas run` with:

```bash
agentpaas logs RUN_ID_FROM_OUTPUT
agentpaas audit query --run-id RUN_ID_FROM_OUTPUT
```

Replace `RUN_ID_FROM_OUTPUT` with the real ID printed by the command. Do not copy a made-up ID into a command and expect useful logs.

## Push and deploy to Cloud

Log in, push the packed image, and deploy the admitted image:

```bash
agentpaas cloud login
agentpaas cloud push --lock "$HOME/.agentpaas/state/agents/weather-agent/agent.lock"
agentpaas cloud images
agentpaas cloud deploy latest --type agent
agentpaas cloud deployments
```

The deployment receives a `dep_...` ID. Use that ID for cloud configuration and invocation.

## Bind the model credential

Push the secret label, then bind it to the deployment and approved host:

```bash
agentpaas cloud secrets push openrouter-key
agentpaas cloud secrets bind dep_EXAMPLE openrouter-key --as bearer --host openrouter.ai
agentpaas cloud secrets bindings dep_EXAMPLE
```

Replace `dep_EXAMPLE` with the real deployment ID. The binding stores metadata and scope. The secret value stays in the vault.

## Invoke and test in Cloud

Create an invoke token for the deployment, then invoke it:

```bash
agentpaas cloud invoke-token dep_EXAMPLE
export AGENTPAAS_CLOUD_INVOKE_TOKEN='inv_EXAMPLE'
agentpaas cloud invoke dep_EXAMPLE --body '{"query":"weather in Folsom"}' --wait
```

Use the run ID from the response to inspect the result and records:

```bash
agentpaas cloud result RUN_ID_FROM_OUTPUT
agentpaas cloud logs RUN_ID_FROM_OUTPUT
agentpaas cloud audit export RUN_ID_FROM_OUTPUT
```

In the console, check **Components**, **Deployments**, **Runs**, and **Logs**. The cloud agent is the same signed package you tested locally, running under the deployment policy.

See [Agents](agents.md), [AgentPaaS concepts](concepts.md), and [Runs and Audit Logs](runs-audit-logs.md).
