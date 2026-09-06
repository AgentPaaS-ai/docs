# The 30-minute path

Follow the weather agent as a single-agent run. Do not wrap it in a workflow.

1. Open your claim link and set a password.
2. [Set up AgentPaaS](install-macos.md).
3. Confirm the AgentPaaS tools appear in Hermes.
4. Ask Hermes: `Build a weather agent that uses an LLM and responds in a friendly tone.` Store the OpenRouter key with [the LLM key guide](llm-key.md).
5. Run the local check and inspect the audit chain.
6. In your terminal, run `agentpaas cloud login` when Hermes asks for cloud access.
7. Open the console and check Components, Workflows, Deployments, Runs, Logs, and Settings.
8. Optional: after the weather run works, [compose a workflow](workflows.md).

The console is read-only. It does not create components or deploy workflows. See [workflow kinds and edges](workflow-kinds-and-edges.md) and [platform limits](platform-limits.md).

If cloud invoke returns an empty `final_output`, check bindings before invoking again. Cloud packs use `agentpaas pack . --target linux/amd64`; a host-architecture pack can fail in the container. A local multi-stage file is fail-closed.
