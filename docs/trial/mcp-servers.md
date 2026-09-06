# MCP servers

An MCP server is a component that exposes tools through the Model Context Protocol. AgentPaaS admits it to the component registry and runs it through a deployment, like other live components.

## Store an MCP server

Pack the MCP server with AgentPaaS and push it to the cloud component registry. The registry keeps the package, component kind, digest, publisher identity, and signed metadata.

A stored MCP server does not run yet. Create a deployment when you want live compute.

## Deploy and invoke an MCP server

Deploy the registered MCP component. The deployment carries its egress policy and gateway-managed secret bindings. Public MCP access uses the deployment's invoke path and token.

Check the resulting deployment in the cloud console. The console is read-only. Pack, push, deploy, and invoke happen in Hermes or the CLI.

## Use an MCP server in a workflow

A workflow can call an MCP server when the signed workflow declares it. Deploy the MCP server before invoking the workflow. If the deployment is missing, the workflow stage fails with `deployment_not_found`.

See [AgentPaaS concepts](concepts.md) for the component lifecycle and [Build a workflow](workflows.md) for workflow authoring.

> **MCP support note:** AgentPaaS Cloud supports hosted, tool-focused MCP servers over Streamable HTTP. The public endpoint is `/v1/deployments/<deployment-id>/mcp`, protected by the deployment's `inv_...` token. The documented protocol flow uses JSON-RPC `initialize`, `tools/list`, and `tools/call`, with protocol version `2025-03-26`. Declare the server's tools in its package metadata, then test them locally and through the hosted endpoint. Egress policy, gateway-managed secrets, deployment capacity, and run or audit records apply to MCP servers like other components. See [MCP demos](../cli/mcp-demos.md) for a working HTTP example.
