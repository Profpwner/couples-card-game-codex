import type { Meta, StoryObj } from '@storybook/react';
import FollowButton from './FollowButton';

const meta: Meta<typeof FollowButton> = {
  title: 'Marketplace/FollowButton',
  component: FollowButton,
};
export default meta;
type Story = StoryObj<typeof FollowButton>;

export const NotFollowing: Story = { args: { following: false, disabled: false } };
export const Following: Story = { args: { following: true, disabled: false } };
export const Disabled: Story = { args: { following: false, disabled: true } };

