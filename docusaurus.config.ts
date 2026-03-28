import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'BCO Protocol',
  tagline: 'Forest-backed token with elastic supply on TRON',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.recologic.io',
  baseUrl: '/',

  organizationName: 'recologic',
  projectName: 'docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/recologic/docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'BCO Protocol',
      logo: {
        alt: 'BCO Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://recologic.io',
          label: 'Website',
          position: 'right',
        },
        {
          href: 'https://github.com/recologic/bco-protocol',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Protocol',
          items: [
            {label: 'Overview', to: '/'},
            {label: 'Contracts', to: '/contracts/bco-token'},
            {label: 'Security', to: '/security/overview'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'X / Twitter', href: 'https://x.com/recologic_io'},
            {label: 'GitHub', href: 'https://github.com/recologic'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'TronScan', href: 'https://tronscan.io/#/token20/TWyRGyikCy1TGkz9etJr8a3NDQcMx3F28p'},
            {label: 'Source Code', href: 'https://github.com/recologic/bco-protocol'},
          ],
        },
      ],
      copyright: `Copyright \u00A9 ${new Date().getFullYear()} REcologic. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
