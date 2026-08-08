---
id: secrets
title: Secrets
sidebar_label: Secrets
---

Secrets live in the macOS Keychain. **Values are never printed** by `list`.

## Local

```bash
# create / update (value from stdin or TTY prompt)
agentpaas secret add openrouter
printf '%s' "$OPENROUTER_API_KEY" | agentpaas secret add openrouter

agentpaas secret list
agentpaas secret rotate openrouter
agentpaas secret test openrouter --provider openrouter
agentpaas secret remove openrouter
```

Aliases: `secret` and `secrets`.

## Rules for agents

1. Never ask the user to paste a key into chat.  
2. Coach: run `secret add <label>` in the **user terminal**.  
3. Confirm with `secret list` (labels only).  
4. For cloud, push and bind after deploy (see [Cloud](./cloud)).
