import React from 'react';
import AnalyticsCards from './AnalyticsCards';

export default {
  title: 'Analytics/AnalyticsCards',
  component: AnalyticsCards,
  argTypes: {
    sales: {
      control: 'object',
      description: 'Sales metrics { packsSold, revenueCents }',
    },
    eng: {
      control: 'object',
      description: 'Engagement metrics { readers, avgSessionSec }',
    },
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'Displays simple analytics cards for Sales and Engagement. Use Controls to adjust values and preview formatting.',
      },
    },
  },
};

export const Loading = () => <AnalyticsCards sales={null} eng={null} />;

export const WithData = (args: any) => (
  <AnalyticsCards
    sales={args.sales ?? { packsSold: 42, revenueCents: 123456 }}
    eng={args.eng ?? { readers: 256, avgSessionSec: 312 }}
  />
);
WithData.args = {
  sales: { packsSold: 42, revenueCents: 123456 },
  eng: { readers: 256, avgSessionSec: 312 },
};
