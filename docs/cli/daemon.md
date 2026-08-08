---
id: daemon
title: Daemon
sidebar_label: Daemon
---

The control daemon (`agentpaasd`) must be running for pack, run, logs, and most local operations.

```bash
agentpaas daemon start
agentpaas daemon status
agentpaas daemon stop
agentpaas daemon restart
```

Also available: `daemon install` / `daemon uninstall` (launch agent integration).

### Tips for agents

1. Call `daemon status` (or `doctor`) before pack/run.  
2. If the socket is missing, `daemon start`.  
3. Default socket: `~/.agentpaas/daemon.sock` (override with `--socket`).
