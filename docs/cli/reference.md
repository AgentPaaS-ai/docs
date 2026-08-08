---
id: reference
title: Full command list
sidebar_label: Full command list
---

Generated from `agentpaas --help` on CLI **0.3.7**. Run `agentpaas <cmd> --help` on your machine for flags that may differ by patch version.

## Top level

```text
audit           Query and export audit logs
bundle          Offline bundle operations (no daemon)
cloud           Manage AgentPaaS Cloud account
completion      Shell autocompletion
confirm         Approve or decline a pending trust-boundary change
confirmations   List pending trust-boundary confirmations
cron            Manage cron schedules for agent invocations
daemon          Manage the AgentPaaS control daemon
deploy          Manage exact deployments and aliases (state-only)
doctor          Run system diagnostics
explain-denial  Explain why a destination was denied by policy
explain-failure Analyze a failed run and return root cause
export          Export a signed .agentpaas bundle from a project
fork            Fork an installed agent into an editable project
identity        Manage publisher identity (init, show, export, import)
init            Initialize a new agent project
install         Verify and install a signed AgentPaaS bundle
installed       Manage installed shared agents
logs            Follow or query agent logs
next-action     Recommend the next action based on current context
pack            Build an agent image from a project directory
policy          Manage agent policies
provenance      Show provenance chains for installed agents or bundles
recommend-patch Suggest a policy patch for a desired behavior
registry        Query the local package registry
run             Start a new agent run
secret          Manage local profile secrets
status          Show daemon status or a specific run's status
stop            Terminate a running agent
summarize       Generate a summary of a completed run
timeline        Show chronological timeline of events for a run
trigger         Manage agent triggers and invocations
trust           Manage trusted publisher keys
validate        Validate an agent project directory structure
version         Print CLI version information
```

## cloud

```text
audit        Query the cloud audit log
cancel       Cancel a cloud run
cron         Manage cloud deployment cron schedules
deploy       Deploy an admitted image
deployments  List cloud deployments
events       Show events for a cloud run
images       List admitted cloud images
invoke       Invoke a cloud deployment
invoke-token Mint a deployment invoke token
login        Log in to AgentPaaS Cloud
logout       Log out of AgentPaaS Cloud
logs         Print logs from a cloud run
metrics      Show cloud audit and run metrics
pull         Download a cloud agent image into a local project directory
push         Push a packed agent image
registry     List tenant assets and the platform MCP catalog
result       Show the result package for a cloud run
run          Create a cloud run from a deployment
secrets      Push and list cloud secrets (labels only)
status       Show cloud run status
undeploy     Undeploy a cloud deployment
usage        Show cloud usage and plan limits
whoami       Show authenticated cloud user info
```

## cloud secrets

```text
push       Push local keychain secrets to the cloud
list       List cloud secret labels
bind       Bind a cloud secret to a deployment
bindings   List secret bindings on a deployment
```

## cloud cron

```text
set        Create or change a schedule (enables it)
           --expr every_1m|every_5m|every_15m|every_1h
           or 5-field UTC cron: "30 9 * * 1-5"
list       List schedules
disable    Disable without deleting stored schedule
enable     Re-enable
```
