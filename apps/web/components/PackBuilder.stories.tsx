import React from 'react';
import PackBuilder from './PackBuilder';

export default {
  title: 'Components/PackBuilder',
  component: PackBuilder,
  parameters: {
    docs: {
      description: {
        component: 'Creator pack builder demo with drag-and-drop and a submit stub.',
      },
    },
  },
};

export const Default = () => <PackBuilder />;
