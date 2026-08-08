# AgentPaaS Docs (Docusaurus)

**Live:** https://docs.agentpaas.ai  
**Worker:** `agentpaas-docs`  
**Umbrella path:** `~/projects/agentpaas/docs-site`

## Edit content

Markdown under `docs/`. Agents and humans edit the same files.

```bash
cd ~/projects/agentpaas/docs-site
npm start          # local
npm run build
npx wrangler deploy  # needs CF token + CLOUDFLARE_ACCOUNT_ID
```

Custom domain is already attached: `docs.agentpaas.ai` → worker `agentpaas-docs`.

## Sync from OSS customer docs

Trial/release sources of truth also live in `oss/docs/customer/`. After editing OSS, re-copy into `docs-site/docs/` (or edit docs-site directly and mirror back).

## Navbar

Console · Home · GitHub backlinks are in `docusaurus.config.ts`.
