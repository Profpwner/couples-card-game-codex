import type { Meta, StoryObj } from '@storybook/react';
import MarketplaceListPanel from './MarketplaceListPanel';
import type { PackSummary } from './MarketplaceListPanel';
import { within, userEvent } from '@storybook/testing-library';

const meta: Meta<typeof MarketplaceListPanel> = {
  title: 'Marketplace/ListPanel',
  component: MarketplaceListPanel,
  parameters: {
    a11y: { disable: false },
  },
};
export default meta;
type Story = StoryObj<typeof MarketplaceListPanel>;

const packs: PackSummary[] = [
  { pack_id: '1', title: 'Sunny Day Pack' },
  { pack_id: '2', title: 'Night Owl Pack' },
  { pack_id: '3', title: 'Morning Routine Pack' },
  { pack_id: '4', title: 'Zesty Conversations' },
];

export const Default: Story = { args: { packs } };

export const SearchAndSort: Story = {
  args: { packs },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = await canvas.findByPlaceholderText('Search packs');
    await userEvent.type(search, 'pack');
    const sort = await canvas.findByDisplayValue('Newest');
    await userEvent.selectOptions(sort, 'Title');
  },
  parameters: { a11y: { disable: false } },
};

