import type { Meta, StoryObj } from '@storybook/react';
import MarketplaceCard from './MarketplaceCard';

const meta: Meta<typeof MarketplaceCard> = {
  title: 'Marketplace/MarketplaceCard',
  component: MarketplaceCard,
  parameters: { a11y: { disable: false } },
};
export default meta;
type Story = StoryObj<typeof MarketplaceCard>;

export const Basic: Story = {
  args: {
    title: 'Sunny Day Pack',
    description: 'Lighthearted prompts for a bright mood.',
    averageRating: 4.2,
    reviewsCount: 128,
  },
};

export const WithLongTitle: Story = {
  args: {
    title: 'A Very Long Title to Verify Wrapping and Focus Handling for Accessibility',
    description: 'Ensure card remains operable with keyboard.',
    averageRating: 3.6,
    reviewsCount: 42,
  },
};

