---
unlisted: true
title: Platform limits
---

# Platform limits

Hard numbers for the trial. Paid numbers are not listed here.

| Dial | Trial |
|------|-------|
| Agents deployed | 5 |
| Tools deployed | 5 |
| MCP deployed | 5 |
| Workflow recipes | Unlimited. Not a server. Running members count toward concurrent runs. |
| Concurrent runs | 10. Extra invokes wait, then fail. A workflow step timeout fails the workflow. |
| File via invoke upload | 50 MiB. Over is 413. |
| API JSON body | 10 MiB. Over is 413. |
| Cron | Named minimum every 5 minutes. Also every 15 minutes and hourly. One-minute is rejected. |
| Fan-out copies | 1-64 |
| Stages | At most 32 |
| Retry | At most 3, transient only |

URL file input requires a host already packed on the agent. Google Drive and Docs share links are not 0.4.

Same-name deploy creates a new deployment id. Cron stays on the old id until you set cron on the new one and disable the old.
