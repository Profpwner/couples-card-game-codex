import type { Meta, StoryObj } from '@storybook/react';
import Stars from './Stars';

const meta: Meta<typeof Stars> = {
  title: 'Marketplace/Stars',
  component: Stars,
};
export default meta;
type Story = StoryObj<typeof Stars>;

export const Five: Story = { args: { rating: 5 } };
export const Three: Story = { args: { rating: 3 } };
export const One: Story = { args: { rating: 1 } };

