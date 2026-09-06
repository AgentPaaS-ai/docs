# Agents

An agent is a component that receives an input, reasons about the task, and takes the actions allowed by its package and runtime policy. Build it in Hermes, test it locally, then move the same package to AgentPaaS Cloud when it is ready.

## Build an agent

Describe the agent in Hermes and evaluate its behavior in your own environment. Keep credentials out of the agent code and out of chat. Declare the hosts and tools the agent needs before packing it.

When the agent is ready, pack it with AgentPaaS and push the package to the cloud component registry. The registry records the admitted package and its build identity.

## Run an agent

Deploy the registered component to create live compute. The deployment receives a deployment ID, egress policy, and secret bindings. Invoke the deployment directly when the agent does not need a workflow.

Each invocation creates a run. Inspect the run and its records under **Runs** and **Logs** in the cloud console.

## Use an agent in a workflow

Use a workflow when the task needs more than one step. Compose the workflow from deployed component IDs, then push the signed workflow definition to the cloud. The workflow invokes the agent as one of its stages.

See [AgentPaaS concepts](concepts.md) for the registry and deployment lifecycle, and [Workflows](workflow-kinds-and-edges.md) for workflow types.
