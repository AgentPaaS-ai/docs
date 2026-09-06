---
id: choose-your-path
title: Choose your path
sidebar_label: Choose your path
---

Choose the smallest AgentPaaS component that matches the job. Build and test locally, then use Cloud when you need hosted deployments, direct invocation, or signed multi-step execution.

## Choose a component

| Choose | When it fits | Next page |
|---|---|---|
| **Agent** | One component needs to reason over an input and take governed actions. Invoke its deployment directly when it does not need a workflow. | [Build an agent](./build-agent) |
| **MCP server** | A client needs a hosted set of named tools through Model Context Protocol. Cloud hosts MCP servers over Streamable HTTP at the deployment MCP endpoint. | [Build an MCP server](./build-mcp-server) |
| **Tool** | One small service should perform one declared operation with a defined input and output. Invoke it directly or make it a workflow stage. | [Build a tool](./build-tool) |
| **Workflow** | The task needs more than one step, such as linear stages, fan-out with join-all, choice, or a declared phone call. Workflows are signed recipes, not live compute. | [Workflow kinds and edges](./workflow-kinds-and-edges), [Build a workflow](./workflows) |

A single agent, MCP server, or tool does not need a workflow. Deploy each component before a workflow can run. A workflow call must be declared in its signed envelope, and a missing member deployment causes the run to fail.

## Choose where to run

### Local mode

Choose local mode to build, test, and inspect a component on your Mac before sending it to Cloud. The local runtime targets macOS with Docker Desktop or Colima. Local multi-stage runs are unavailable, and local mode trusts the developer's machine.

Start with [Install on macOS](./install-macos), then follow [AgentPaaS concepts](./concepts) or the component guide for your path.

### AgentPaaS Cloud

Choose Cloud when you need a hosted deployment, direct invocation of an agent, MCP server, or tool, Cloud run records, or a signed workflow envelope. Pack Cloud images for `linux/amd64`, push the package, deploy every workflow member, and invoke through the CLI or Hermes. The console is read-only for monitoring components, deployments, workflows, runs, logs, governance, and audits.

Cloud data is processed and stored in the United States. Cloud egress is limited to governed HTTP and HTTPS traffic. The default tier enforces at the per-instance egress boundary and does not claim substrate-enforced isolation. A paid, on-request high-assurance tier provides substrate-enforced network policy.

See [Cloud login](./cloud-login), [Runs and Audit Logs](./runs-audit-logs), and [Architecture](../platform/architecture).

## Current limits

The trial allows **10 live deployments** and **5 concurrent runs**. A workflow definition uses no slot, but each deployed workflow member uses one warm-container slot. Input files are limited to **50 MiB** at the workflow boundary, and API request bodies to **10 MiB**.

The shipped workflow kinds are linear, fan-out with join-all, choice, and phone-call. Native human-in-the-loop, for-each, wait or delay, join-any, local multi-stage runs, spawn depth greater than one, and undeclared standalone agent-to-agent calls are unavailable. Review [Platform limits](./platform-limits) before composing a workflow.
