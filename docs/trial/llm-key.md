---
id: llm-key
title: Your LLM key
sidebar_label: Your LLM key
---

Your agent needs an LLM API key. For the trial we recommend **[OpenRouter](https://openrouter.ai/)** and a low-cost model so setup stays simple and inexpensive.

## Store the key on your Mac

Run this in **your** Terminal (not in chat). Paste the key when prompted so it never appears in the command line or in Hermes history.

```bash
agentpaas secret add openrouter
agentpaas secret list
```

`secret list` shows **labels only**, never the secret value.

Good starter models on OpenRouter: `deepseek/deepseek-chat` or `openai/gpt-4o-mini`.

## Use the key on AgentPaaS Cloud

After you deploy an agent that needs the LLM:

```bash
agentpaas cloud secrets push openrouter
agentpaas cloud secrets bind <deployment> openrouter --as bearer --host openrouter.ai
```

Replace `<deployment>` with your deployment id from the console or CLI.

## Tips

- Prefer OpenRouter for the guided weather demo; other HTTPS providers work when your agent policy allows their host.
- Rotate by running `secret add` / `cloud secrets push` again for the **same label**.
- You cannot delete a secret while deployments still bind it (unless you force unbind first).
