import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AgentPaaS Docs',
  tagline: 'Secure PaaS for agents, applications, MCP servers, and agentic workflows',
  favicon: 'img/favicon.svg',
  future: {v4: true},
  url: 'https://docs.agentpaas.ai',
  baseUrl: '/',
  organizationName: 'AgentPaaS-ai',
  projectName: 'agentpaas',
  onBrokenLinks: 'warn',
  i18n: {defaultLocale: 'en', locales: ['en']},
  markdown: {mermaid: true},
  presets: [
    ['classic', {
      docs: {
        routeBasePath: '/',

        sidebarPath: './sidebars.ts',
        editUrl: ({docPath}: {docPath: string}) => `https://github.com/AgentPaaS-ai/docs/edit/main/docs/${docPath}`,
        showLastUpdateTime: false,
      },
      blog: false,
      theme: {customCss: './src/css/custom.css'},
    } satisfies Preset.Options],
  ],
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [require.resolve('./plugins/raw-markdown/index.js')],
  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {defaultMode: 'dark', disableSwitch: true, respectPrefersColorScheme: false},
    navbar: {
      title: 'AgentPaaS',
      logo: {alt: 'AgentPaaS', src: 'img/logo-mark.png', srcDark: 'img/logo-mark.png', href: 'https://agentpaas.ai/', target: '_self'},
      items: [
        {type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs'},
        {to: '/security/threat-model', label: 'Security', position: 'left'},
        {to: '/platform/architecture', label: 'Platform', position: 'left'},
        {href: 'https://cloud.agentpaas.ai/', label: 'Console', position: 'right', target: '_self'},
        {href: 'https://agentpaas.ai/', label: 'Home', position: 'right', target: '_self'},
        {href: 'https://github.com/AgentPaaS-ai/docs', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'Docs', items: [{label: 'Start here', to: '/'}, {label: 'Documentation map', to: '/documentation-map'}, {label: 'Q&A', to: '/faq'}, {label: 'Trial guide', to: '/trial/'}, {label: 'AgentPaaS CLI', to: '/cli/'}, {label: 'Release v0.4.0', to: '/releases/v0.4.0'}, {label: 'Versioning', to: '/versioning'}]},
        {title: 'Product', items: [{label: 'Cloud console', href: 'https://cloud.agentpaas.ai/'}, {label: 'Home', href: 'https://agentpaas.ai/'}, {label: 'Docs on GitHub', href: 'https://github.com/AgentPaaS-ai/docs'}, {label: 'CLI source', href: 'https://github.com/AgentPaaS-ai/agentpaas'}]},
        {title: 'Security', items: [{label: 'Threat model', to: '/security/threat-model'}, {label: 'How enforcement works', to: '/security/how-enforcement-works'}]},
        {title: 'Platform', items: [{label: 'Architecture', to: '/platform/architecture'}, {label: 'Access control', to: '/platform/access-control'}]},
      ],
      copyright: `© AgentPaaS · Documentation for CLI 0.4.0+`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula, additionalLanguages: ['bash', 'json', 'yaml', 'go']},
  } satisfies Preset.ThemeConfig,
};

export default config;
