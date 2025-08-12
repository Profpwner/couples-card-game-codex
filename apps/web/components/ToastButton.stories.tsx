import type { Meta, StoryObj } from '@storybook/react';
import ToastButton from './ToastButton';

const meta: Meta<typeof ToastButton> = {
  title: 'Utilities/ToastButton',
  component: ToastButton,
};
export default meta;
type Story = StoryObj<typeof ToastButton>;

export const Success: Story = { args: { kind: 'success', label: 'Success toast', message: 'Saved!' } };
export const Error: Story = { args: { kind: 'error', label: 'Error toast', message: 'Something went wrong' } };
export const Loading: Story = { args: { kind: 'loading', label: 'Loading toast', message: 'Working…' } };
