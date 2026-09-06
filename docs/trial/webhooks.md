# Webhooks

Webhooks provide ingress and completion delivery through the API. Configure them with the `agentpaas cloud webhook` commands.

## Ingress webhook

An ingress webhook lets an external service start a run. Configure it with the CLI and keep the HMAC secret in your credential store.

```bash
agentpaas cloud webhook set dep_EXAMPLE --provider generic_hmac --secret-stdin
```

The CLI configures `PUT /v1/deployments/dep_EXAMPLE/webhook`. The configured response contains `configured`, `provider`, and `deployment_id`, and does not return the secret.

To send a signed test request:

```bash
agentpaas cloud webhook fire dep_EXAMPLE --body '{"ok":true}' --secret-stdin
```

The request uses `POST /v1/deployments/dep_EXAMPLE/hooks/generic_hmac` and the `X-Agentpaas-Signature` header. Invalid or stale signatures return HTTP `401` and do not start a run.

## Completion and delivery webhooks

Configure public HTTPS destinations for terminal status and final output delivery:

```bash
agentpaas cloud webhook completion dep_EXAMPLE --url https://webhook.site/example-completion
agentpaas cloud webhook delivery dep_EXAMPLE --url https://webhook.site/example-delivery
```

These configure `PUT /v1/deployments/dep_EXAMPLE/completion-webhook` and `PUT /v1/deployments/dep_EXAMPLE/delivery-webhook`. Use different URLs so you can distinguish the two requests. Completion sends the run ID and terminal state. Delivery sends `final_output` only. Logs, secrets, and artifacts are not included.

There is no dedicated console workflow for configuring webhooks. Use Hermes or the AgentPaaS CLI. See [Cloud commands](../cli/cloud) for the surrounding deployment and invoke flow.
