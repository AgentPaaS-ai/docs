---
sidebar_label: Documentation map
title: Documentation map
---

# Documentation map

Use this map to choose a starting page by task. The links are grouped by the work a reader or coding agent needs to do. For programmatic reading, append `.md` to the page path, as described on the [documentation home](/).

| Task | Start here | Follow-up pages |
|---|---|---|
| Understand AgentPaaS and its deployment flow | [What is AgentPaaS?](./trial/what-is-agentpaas) | [The 30-minute path](./trial/thirty-minute-path), [AgentPaaS concepts](./trial/concepts) |
| Complete the trial happy path | [The 30-minute path](./trial/thirty-minute-path) | [Set up AgentPaaS](./trial/install-macos), [LLM key guide](./trial/llm-key), [Troubleshooting](./trial/troubleshooting) |
| Install the local CLI | [CLI install](./cli/install) | [Daemon](./cli/daemon), [Doctor](./cli/doctor), [CLI overview](./cli/) |
| Build and test a local project | [Projects](./cli/projects) | [Pack and run](./cli/pack-run), [Policy](./cli/policy), [Audit and lineage](./cli/audit-lineage) |
| Build an agent | [Build an agent](./trial/build-agent) | [Agents](./trial/agents), [What is AgentPaaS?](./trial/what-is-agentpaas) |
| Build an MCP server | [Build an MCP server](./trial/build-mcp-server) | [MCP servers](./trial/mcp-servers), [MCP demos](./cli/mcp-demos) |
| Build a tool | [Build a tool](./trial/build-tool) | [Tools](./trial/tools) |
| Compose a workflow | [Workflows](./trial/workflows) | [Workflow kinds and edges](./trial/workflow-kinds-and-edges), [Platform limits](./trial/platform-limits) |
| Log in to Cloud | [Cloud login](./trial/cloud-login) | [Cloud](./cli/cloud), [Cloud pull](./trial/cloud-pull) |
| Push, deploy, invoke, or inspect a Cloud run | [Cloud](./cli/cloud) | [Runs, audit, and logs](./trial/runs-audit-logs), [Audit and lineage](./cli/audit-lineage) |
| Manage local or Cloud credentials | [Credentials and secrets](./security/credentials) | [Secrets and bindings](./cli/secrets), [Data handling](./security/data-handling) |
| Define or inspect policy | [Policy](./cli/policy) | [How enforcement works](./security/how-enforcement-works), [Known limitations](./security/known-limitations) |
| Understand the platform architecture | [Architecture](./platform/architecture) | [Threat model](./security/threat-model), [How enforcement works](./security/how-enforcement-works) |
| Compare enforcement tiers | [How enforcement works](./security/how-enforcement-works) | [Threat model](./security/threat-model), [Known limitations](./security/known-limitations) |
| Review security boundaries and claims | [Threat model](./security/threat-model) | [Known limitations](./security/known-limitations), [Architecture](./platform/architecture) |
| Check current security gaps | [Known limitations](./security/known-limitations) | [Threat model](./security/threat-model), [Audit export](./security/audit-export) |
| Export and verify audit evidence | [Audit export](./security/audit-export) | [Audit and lineage](./cli/audit-lineage), [Known limitations](./security/known-limitations) |
| Review compliance status and subprocessors | [Compliance and attestations](./security/compliance) | [Threat model](./security/threat-model), [Data handling](./security/data-handling) |
| Check data residency and provider handling | [Data handling](./security/data-handling) | [Architecture](./platform/architecture), [Compliance and attestations](./security/compliance) |
| Review package identity and provenance | [Trust model](./security/trust-model) | [Identity and trust](./cli/identity-trust), [Known limitations](./security/known-limitations) |
| Find current product limits | [Platform limits](./trial/platform-limits) | [Known limitations](./security/known-limitations) |
| Troubleshoot a trial or run | [Troubleshooting](./trial/troubleshooting) | [The 30-minute path](./trial/thirty-minute-path), [Doctor](./cli/doctor) |
| Read release changes | [Release notes v0.4.0](./releases/v0.4.0) | [Documentation home](/) |

## Security facts to keep in view

- Local enforcement is topological through an internal-only network and gateway sidecar.
- Cloud default-tier enforcement is at the per-instance egress boundary through the control plane and gateway. It is not presented as substrate-enforced isolation.
- The paid, on-request high-assurance tier uses substrate-enforced network policy in a dedicated Kubernetes namespace.
- The governed network scope is HTTP and HTTPS. Raw TCP, UDP, and ICMP are outside the current transparent proxy model.
- AgentPaaS does not claim to prevent prompt injection.
- AgentPaaS is working toward SOC 2 and is not yet certified.
- AgentPaaS Cloud data is processed and stored in the United States.
