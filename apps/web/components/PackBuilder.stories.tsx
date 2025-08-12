import React from 'react';
import React from 'react';
import PackBuilder from './PackBuilder';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, screen } from '@storybook/testing-library';

const meta: Meta<typeof PackBuilder> = {
  title: 'Creator/PackBuilder',
  component: PackBuilder,
  parameters: {
    docs: {
      description: {
        component: 'Creator pack builder demo with drag-and-drop, partial PATCHes, and submit stub.',
      },
    },
    a11y: { disable: false },
  },
};
export default meta;
type Story = StoryObj<typeof PackBuilder>;

export const Default: Story = { render: () => <PackBuilder /> };

export const AddCardFlow: Story = {
  render: () => <PackBuilder />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Add Card'));
    const input = await canvas.findByPlaceholderText('Type card text');
    await userEvent.type(input, 'Story-added card');
  },
};

export const EditFirstCardFlow: Story = {
  render: () => <PackBuilder />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const editButtons = await canvas.findAllByText('Edit');
    await userEvent.click(editButtons[0]);
    const editInput = await canvas.findByLabelText('Edit card text');
    await userEvent.clear(editInput);
    await userEvent.type(editInput, 'Edited via Story');
  },
};

export const WithPackIdAndTitle: Story = {
  render: () => <PackBuilder />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const packInput = canvas.getByPlaceholderText('e.g. p1');
    const titleInput = canvas.getByPlaceholderText('New pack title');
    await userEvent.type(packInput, 'demo-pack');
    await userEvent.type(titleInput, 'My Demo Pack');
  },
};
