import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'index',
    {
      type: 'category',
      label: 'AgentPaaS Trial',
      collapsed: false,
      items: [
        'trial/what-is-agentpaas',
        'trial/guided-demo',
        'trial/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'AgentPaaS Console',
      collapsed: true,
      items: ['trial/dashboard-tour', 'versioning'],
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
      items: ['releases/v0.3.7', 'platform'],
    },
  ],
};

export default sidebars;
