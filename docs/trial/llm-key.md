# Add an LLM key

OpenRouter is the first cold path. Add the secret in your terminal, never in Hermes chat.

```bash
agentpaas secret add openrouter-key
agentpaas cloud secrets push openrouter-key
agentpaas cloud secrets bind <deployment-id> openrouter-key --as bearer --host openrouter.ai
agentpaas cloud secrets bindings <deployment-id>
```

A bound deployment can use the credential through the gateway. If secret deletion returns a conflict while a deployment is bound, rotate the same label or unbind it first.
