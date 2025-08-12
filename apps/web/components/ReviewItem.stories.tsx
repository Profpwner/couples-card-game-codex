import type { Meta, StoryObj } from '@storybook/react';
import { ReviewItem } from './ReviewItem';

const meta: Meta<typeof ReviewItem> = {
  title: 'Marketplace/ReviewItem',
  component: ReviewItem,
  parameters: { a11y: { disable: false } },
};
export default meta;
type Story = StoryObj<typeof ReviewItem>;

export const Basic: Story = {
  args: {
    review: {
      review_id: 'r1',
      user_id: 'u1',
      rating: 4,
      review_text: 'Great pack! Lots of variety and fun.',
      created_at: new Date().toISOString(),
    },
  },
};
