---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

Quick fixes for the [guided demo](./guided-demo). Prefer asking Hermes in plain language after you unblock yourself.

## Claim and browser login

| Problem | What to do |
|---------|------------|
| No access yet | Request a trial on [agentpaas.ai](https://agentpaas.ai/) and open the claim email |
| Hermes stuck on cloud login | Stop. In your Terminal run `agentpaas cloud login`, open the URL in the **same browser** as the claim, Approve, then tell Hermes to continue |
| Wrong browser | CLI approve must use the claim browser |

## Hermes and install

| Problem | What to do |
|---------|------------|
| AgentPaaS tools missing | Paste `Install from https://github.com/AgentPaaS-ai/agentpaas` again; `/quit` and reopen Hermes if needed |
| macOS blocks binaries | Ask Hermes how to clear quarantine, or right-click Open on the app |

## Agent ran but answer is empty

| Problem | What to do |
|---------|------------|
| No weather / empty LLM answer | Ask Hermes to check cloud secret bindings for your deployment and bind your OpenRouter (or LLM) secret to the right host |
| Policy denial | Check lineage/audits for `egress_denied`; add only the host you intend, then repack |

## Console

| Problem | What to do |
|---------|------------|
| Cannot find the run | Open **Runs**, filter by time; expand the row |
| Want a schedule | Ask Hermes: "Schedule this deployment every 5 minutes" |

Still stuck? Reply on your trial email thread or contact from [agentpaas.ai](https://agentpaas.ai/).
