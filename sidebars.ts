import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'overview',
    'how-it-works',
    'architecture',
    'tokenomics',
    'governance',
    {
      type: 'category',
      label: 'Contracts',
      items: [
        'contracts/bco-token',
        'contracts/deed-registry',
        'contracts/bco-staking',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/overview',
        'security/roles-and-permissions',
        'security/timelock',
        'security/audit',
        'security/risk-disclosure',
        'security/bug-bounty',
      ],
    },
    {
      type: 'category',
      label: 'Developers',
      items: [
        'developers/addresses',
        'developers/integration',
        'developers/testnet',
        'developers/examples',
        'developers/events',
      ],
    },
    'faq',
    'changelog',
    'glossary',
  ],
};

export default sidebars;
