# Tools

A tool is a component that performs a declared operation for an agent or workflow. Tools can be deployed and invoked on their own, or used as members of a signed workflow.

## Store a tool

Pack the tool with AgentPaaS and push it to the cloud component registry. The registry records the package, component kind, digest, publisher identity, and signed build metadata.

A tool in the registry is stored software. It becomes live compute only after deployment.

## Deploy a tool

Deploy the registered tool to create live compute. The deployment has a deployment ID, allowed egress, and gateway-managed secret bindings. Invoke the deployment directly when the tool does not need a workflow.

## Use a tool in a workflow

Compose a workflow from deployed component IDs. A tool can be one of the workflow stages when the signed workflow declares it. Deploy every member component before invoking the workflow.

A call to a tool outside the signed workflow envelope fails closed. Review the workflow run and policy records under **Runs** and **Logs**.

See [AgentPaaS concepts](concepts.md) for the registry and deployment lifecycle, and [Workflows](workflow-kinds-and-edges.md) for workflow types.
