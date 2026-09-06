# Troubleshooting

## Login

Run `agentpaas cloud login` in your terminal and approve the same browser session used for the claim link. If Hermes waits for login, stop Hermes, run the command yourself, then approve in the claim browser. Never paste an `apc_` token into chat.

## Workflow invocation

If a workflow run fails with `deployment_not_found`, one of its member deployments was deleted or is missing. The workflow definition remains stored, but the affected stage cannot launch without its deployment. Redeploy every member component, then invoke the workflow again. Deleting a deployment also removes its secret bindings, so restore those bindings before the next run.

## Empty cloud output

If `final_output` is empty, inspect secret bindings and the run logs before retrying.

## Pack failure

Cloud images need `agentpaas pack . --target linux/amd64`. Local multi-stage runs fail closed. Use a signed cloud envelope for staged execution.

## Missing Hermes tools

Run `/quit`, reopen Hermes, and run the AgentPaaS doctor command.
