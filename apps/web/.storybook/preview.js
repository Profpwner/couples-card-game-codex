import '../styles/globals.css';
import React, { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'Light',
    values: [
      { name: 'Light', value: '#ffffff' },
      { name: 'Dark', value: '#0b0b0b' },
      { name: 'Gray', value: '#f5f5f7' },
    ],
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      dynamicTitle: true,
    },
  },
};

const ThemeDecorator = (Story, context) => {
  const theme = context.globals.theme || 'light';
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  // expose toast for quick story demos
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.toast = toast;
    }
  }, []);
  return (
    <>
      <Story />
      <Toaster position="bottom-right" />
    </>
  );
};

export const decorators = [ThemeDecorator];
