# Build an MCP server

> **Use Hermes for the whole flow:** Ask Hermes to build an MCP server and it can run the AgentPaaS CLI commands for packing, pushing, deploying, and invoking it. You still approve cloud login in your browser and enter private credentials in your Terminal when prompted.

An MCP server is a component that exposes named tools through the Model Context Protocol. Build it locally, define the tools it offers, test those tools, then push and deploy the same package in AgentPaaS Cloud.

## Build the server locally

In Hermes, describe the server and its boundaries:

```text
Build an MCP server with a fetch tool. The tool accepts a URL and max_length, allows only the approved hosts, returns the fetched text and status, and never receives raw credentials.
```

Your MCP server advertises its tools through the MCP `tools/list` method. Each tool has a name, description, and input schema. The server handles calls through `tools/call` and applies the input validation in its own code.

Keep the server's tool list narrow. A tool should do one named job and reject arguments outside its schema.

## Test the MCP server locally

Start the AgentPaaS daemon, pack the project, and run it locally:

```bash
agentpaas daemon start
agentpaas pack ./weather-mcp
agentpaas run ./weather-mcp
agentpaas status
```

Use an MCP client that can connect to the local server and run two checks:

1. List the server's tools and confirm the expected tool name and input schema.
2. Call the tool with an allowed input, then call it with a disallowed host or invalid argument.

Inspect the run records:

```bash
agentpaas logs RUN_ID_FROM_OUTPUT
agentpaas audit query --run-id RUN_ID_FROM_OUTPUT
```

The denied request should produce a policy record. Use the real run ID printed by the CLI.

## Push and deploy the MCP server

Pack for the cloud, push the signed image, and deploy it as an MCP component:

```bash
agentpaas pack ./weather-mcp --target linux/amd64
agentpaas cloud push --lock "$HOME/.agentpaas/state/agents/weather-mcp/agent.lock"
agentpaas cloud images
agentpaas cloud deploy latest --type mcp
agentpaas cloud deployments
```

Create an invoke token for the resulting `dep_...` deployment:

```bash
agentpaas cloud invoke-token dep_EXAMPLE
export AGENTPAAS_MCP_INVOKE_TOKEN='inv_EXAMPLE'
```

## Test the MCP server in Cloud

The hosted MCP endpoint is `/mcp`. It is not the agent invoke endpoint. Initialize the server, then list its tools:

```bash
curl -sS -X POST \
  "https://cloud.agentpaas.ai/v1/deployments/dep_EXAMPLE/mcp" \
  -H "Content-Type: application/json" \
  -H "X-Agentpaas-Invoke-Token: $AGENTPAAS_MCP_INVOKE_TOKEN" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"local-test","version":"1"}}}'
```

Call one of the advertised tools:

```bash
curl -sS -X POST \
  "https://cloud.agentpaas.ai/v1/deployments/dep_EXAMPLE/mcp" \
  -H "Content-Type: application/json" \
  -H "X-Agentpaas-Invoke-Token: $AGENTPAAS_MCP_INVOKE_TOKEN" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"fetch","arguments":{"url":"https://example.com","max_length":500}}}'
```

Replace `dep_EXAMPLE` and `fetch` with your real deployment ID and tool name. Confirm the response, then check **Runs** and **Logs** in the console.

## Add OAuth for a user's account

Use delegated OAuth when the MCP server must call a third-party API on behalf of an end user. The client ID and optional client secret are secret labels. The server never receives the raw OAuth client credentials.

Push the OAuth client credentials to the tenant vault first:

```bash
agentpaas cloud secrets push acme-client-id
agentpaas cloud secrets push acme-client-secret
```

Bind the OAuth configuration to the MCP deployment:

```bash
agentpaas cloud secrets bind dep_EXAMPLE acme-oauth \
  --as oauth_delegated \
  --host api.acme.example \
  --end-user-identity alice@example.com \
  --oauth-provider acme \
  --oauth-client-id-credential acme-client-id \
  --oauth-client-secret-credential acme-client-secret \
  --oauth-scopes read:items \
  --oauth-max-scopes read:items
```

The binding requires a provider, client ID secret, scopes, maximum scopes, and end-user identity. The requested scopes must be included in the maximum scopes. Authorization and token endpoints, when configured, must use HTTPS.

On the first call for that user, the server receives an `authorization_required` result with a `consent_url`, `grant_id`, and `credential_id`. Open the consent URL in the user's browser and approve the requested scopes. AgentPaaS stores the delegated access and refresh tokens server-side. Later calls reuse the access token or refresh it when it expires. The token values never appear in the audit record.

OAuth events such as consent required, consent granted, token refreshed, token injected, scope violation, and revocation are recorded as metadata-only audit events.

To revoke a grant, use the verified grant ID:

```bash
agentpaas cloud oauth revoke dep_EXAMPLE acme-oauth alice@example.com
```

See [MCP servers](mcp-servers.md), [AgentPaaS concepts](concepts.md), and [Runs and Audit Logs](runs-audit-logs.md).
