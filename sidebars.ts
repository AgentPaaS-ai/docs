import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'index',
    {
      type: 'category',
      label: 'Trial',
      collapsed: false,
      items: [
        'trial/index',
        'trial/what-is-agentpaas',
        'trial/guided-demo',
        'trial/dashboard-tour',
        'trial/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Releases',
      items: ['releases/v0.3.7'],
    },
    {
      type: 'category',
      label: 'Platform',
      items: ['versioning', 'platform'],
    },
    {
      type: 'category',
      label: 'Security',
      items: ['security/threat-model', 'security/how-enforcement-works'],
    },
  ],
};

export default sidebars;
