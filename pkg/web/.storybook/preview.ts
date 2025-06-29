import type { Preview } from '@storybook/nextjs'
import React from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { withStorybookProviders } from '../src/decorators/with-storybook-providers';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1b1e',
        },
      ],
    },
  },
  decorators: [
    withStorybookProviders,
    (Story) => React.createElement(MantineProvider, {}, React.createElement(Story)),
  ],
};

export default preview;