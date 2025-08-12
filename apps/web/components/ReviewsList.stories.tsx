import type { Meta, StoryObj } from '@storybook/react';
import ReviewsList from './ReviewsList';
import type { Review } from './ReviewItem';

const meta: Meta<typeof ReviewsList> = {
  title: 'Marketplace/ReviewsList',
  component: ReviewsList,
  parameters: { a11y: { disable: false } },
};
export default meta;
type Story = StoryObj<typeof ReviewsList>;

const base: Review[] = [
  { review_id: 'r1', user_id: 'u1', rating: 5, review_text: 'Amazing!', created_at: new Date().toISOString() },
  { review_id: 'r2', user_id: 'u2', rating: 3, review_text: 'Okay', created_at: new Date(Date.now() - 86400000).toISOString() },
  { review_id: 'r3', user_id: 'u3', rating: 1, review_text: 'Not good', created_at: new Date(Date.now() - 2*86400000).toISOString() },
  { review_id: 'r4', user_id: 'u4', rating: 4, created_at: new Date(Date.now() - 3*86400000).toISOString() },
  { review_id: 'r5', user_id: 'u5', rating: 2, review_text: 'Meh', created_at: new Date(Date.now() - 4*86400000).toISOString() },
  { review_id: 'r6', user_id: 'u6', rating: 5, created_at: new Date(Date.now() - 5*86400000).toISOString() },
];

export const SortedNewest: Story = { args: { reviews: base, sort: 'newest', visible: 6 } };
export const SortedHighest: Story = { args: { reviews: base, sort: 'highest', visible: 6 } };
export const SortedLowest: Story = { args: { reviews: base, sort: 'lowest', visible: 6 } };
export const Paginated: Story = { args: { reviews: base, sort: 'newest', visible: 3 } };
