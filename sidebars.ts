import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'index',
    'documentation-map', 'faq',
    {type: 'category', label: 'AgentPaaS', collapsed: false, items: [
      'trial/what-is-agentpaas', 'trial/choose-your-path', 'trial/index', 'trial/guided-demo', 'trial/install-macos', 'trial/concepts',
      {type: 'category', label: 'Agents', items: ['trial/agents', 'trial/build-agent', 'trial/guided-demo']},
      {type: 'category', label: 'MCP servers', items: ['trial/mcp-servers', 'trial/build-mcp-server', 'cli/mcp-demos']},
      {type: 'category', label: 'Tools', items: ['trial/tools', 'trial/build-tool']},
      {type: 'category', label: 'Workflows', items: ['trial/workflow-kinds-and-edges', 'trial/workflows']},
      {type: 'category', label: 'Gateway', collapsed: false, items: [
        'trial/gateway', 'trial/gateway-security', 'trial/gateway-roadmap',
      ]},
      {type: 'category', label: 'Athena', collapsed: false, items: [
        'trial/what-athena-can-do', 'trial/athena-questions', 'trial/athena-debugging',
      ]},
      'trial/runs-audit-logs', 'trial/troubleshooting',
    ]},
    {type: 'category', label: 'Operations', collapsed: true, items: [
      'trial/cloud-login', 'trial/cloud-pull', 'trial/llm-key', 'trial/cloud-cron',
      'trial/webhooks', 'trial/platform-limits',
    ]},
    {type: 'category', label: 'AgentPaaS CLI', collapsed: true, items: [
      'cli/index', 'cli/install', 'cli/daemon', 'cli/doctor', 'cli/projects', 'cli/pack-run',
      'cli/secrets', 'cli/identity-trust', 'cli/policy', 'cli/audit-lineage', 'cli/cron',
      'cli/cloud', 'cli/invoke-tokens', 'cli/reference',
    ]},
    {type: 'category', label: 'Security', items: [
      'security/security-review', 'security/threat-model', 'security/how-enforcement-works', 'security/credentials',
      'security/audit-export', 'security/trust-model', 'security/known-limitations',
      'security/data-handling', 'security/compliance',
    ]},
    {type: 'category', label: 'Platform', items: ['platform/architecture', 'platform/access-control']},
    {type: 'category', label: 'Releases', items: ['releases/v0.4.0', 'releases/v0.3.7', 'platform']},
  ],
};

export default sidebars;
