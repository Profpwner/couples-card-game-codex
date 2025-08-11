import React from 'react';
import Layout from './Layout';

export default {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    docs: {
      description: {
        component: 'Site layout wrapper with simple header and navigation links.',
      },
    },
  },
};

export const Default = () => (
  <Layout>
    <p>Sample content</p>
  </Layout>
);
