import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'index',
    {
      type: 'category',
      label: 'AgentPaaS Trial',
      collapsed: false,
      items: [
        'trial/index',
        'trial/what-is-agentpaas',
        'trial/guided-demo',
        'trial/dashboard-tour',
        'trial/workflows',
        'trial/workflow-kinds-and-edges',
        'trial/mcp-and-tools',
        'trial/platform-limits',
        'trial/webhooks',
        'trial/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'AgentPaaS CLI',
      collapsed: true,
      items: [
        'cli/index',
        'cli/install',
        'cli/daemon',
        'cli/doctor',
        'cli/projects',
        'cli/pack-run',
        'cli/secrets',
        'cli/identity-trust',
        'cli/policy',
        'cli/audit-lineage',
        'cli/cron',
        'cli/cloud',
        'cli/invoke-tokens',
        'cli/mcp-demos',
        'cli/reference',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: ['security/threat-model', 'security/how-enforcement-works'],
    },
    {
      type: 'category',
      label: 'Releases',
      items: ['releases/v040', 'releases/v0.3.7', 'platform', 'versioning'],
    },
  ],
};

export default sidebars;
