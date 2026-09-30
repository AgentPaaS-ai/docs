# Log in to Cloud

Open your claim link in a browser first. Then run login in your own terminal and confirm the tenant.

```bash
agentpaas cloud login
agentpaas cloud whoami
```

After a successful login, the CLI remembers the Cloud API URL it used. Set `AGENTPAAS_CLOUD_API_URL` when you need to select an endpoint explicitly. Logout clears the saved endpoint.

For scripted access, use the token supplied by the operator through stdin. Never paste the token into chat. If Hermes gets stuck, stop it and complete these commands yourself.
