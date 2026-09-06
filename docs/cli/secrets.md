---
id: secrets
title: Secrets and bindings
sidebar_label: Secrets
---

Store secret values locally through stdin. Push the label to Cloud, then bind
the label to a deployment. Values are brokered at request time. The agent
never holds the raw secret. For the mechanism and what the gateway enforces,
see [Credentials and secrets](/security/credentials).

```bash
agentpaas secret add <label>
agentpaas cloud secrets push <label>
agentpaas cloud secrets bind <deployment-id> <label> --as bearer --host <approved-host>
agentpaas cloud secrets bindings <deployment-id>
```

## Local secret commands

Values are read from stdin (or a TTY prompt) and are never printed back.

```bash
printf '%s' "$KEY" | agentpaas secret add <label>   # create or update (alias: set)
agentpaas secret list                               # names + timestamps, never values
agentpaas secret test <label> --provider <name>     # verify a credential works
printf '%s' "$NEW" | agentpaas secret rotate <label> # atomic replace
agentpaas secret remove <label>                     # delete (alias: rm)
```

## Cloud secrets

`cloud secrets list` and `cloud secrets bindings` print labels only, never
values. If `cloud secrets` deletion returns a conflict while a deployment is
bound, rotate the same label or unbind it first.

## Related

- [Credentials and secrets](/security/credentials)
- [Data handling and LLM providers](/security/data-handling)
