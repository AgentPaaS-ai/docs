# AgentPaaS Docs

**Live:** https://docs.agentpaas.ai 
**Org:** [AgentPaaS-ai](https://github.com/AgentPaaS-ai) 
**This repo is product documentation only** - not the CLI runtime, not the cloud control plane, not the marketing site.

## Repos (separate on purpose)

| Surface | GitHub | Live |
|---------|--------|------|
| **Docs (this repo)** | [AgentPaaS-ai/docs](https://github.com/AgentPaaS-ai/docs) | https://docs.agentpaas.ai |
| **OSS CLI / runtime** | [AgentPaaS-ai/agentpaas](https://github.com/AgentPaaS-ai/agentpaas) | brew `agentpaas` |
| **Cloud control plane** | [AgentPaaS-ai/agentpaas-cloud](https://github.com/AgentPaaS-ai/agentpaas-cloud) | https://cloud.agentpaas.ai |
| **Marketing site** | local umbrella / Pages worker | https://agentpaas.ai |

Do **not** put website Markdown under `agentpaas/docs/docs/`. Edit here.

## Edit / PR

1. Browse https://docs.agentpaas.ai 
2. **Edit this page** → opens the `.md` file in this repo 
3. Open a pull request 
4. Owner merges → deploy docs site

```bash
cd ~/projects/agentpaas/docs-site # local clone of this repo
# edit docs/**/*.md
npm start # preview
npm run build && npx wrangler deploy # publish to docs.agentpaas.ai
```

## Layout

```
docs/ # Markdown (Docusaurus content)
 index.md
 trial/
 releases/
 security/
 ...
docusaurus.config.ts
src/css/custom.css # brand tokens (match agentpaas.ai / cloud)
wrangler.toml # worker agentpaas-docs
```

## License

Documentation © AgentPaaS. Code samples follow the OSS runtime license unless noted.
