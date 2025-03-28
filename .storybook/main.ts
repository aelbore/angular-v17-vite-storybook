import { UserConfig } from 'vite';

const isDevMode = process.env.NODE_ENV === 'development';

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-mdx-gfm"
  ],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  "core": {
    "builder": {
      "name": "@storybook/builder-vite",
      "options": {
        viteConfigPath: undefined
      }
    }
  },
  async viteFinal(config: UserConfig) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');
    const { default: angular } = await import('@analogjs/vite-plugin-angular');

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: [
          '@storybook/angular/dist/client/index.js',
          '@angular/compiler',
          '@angular/platform-browser/animations',
          '@storybook/addon-docs/angular',
          'react/jsx-dev-runtime',
          '@storybook/blocks',
          'tslib',
          'zone.js'
        ],
      },
      plugins: [
        angular({
          jit: !isDevMode,
          liveReload: isDevMode,
          tsconfig: './.storybook/tsconfig.json',
        }),
      ],
      define: {
        STORYBOOK_ANGULAR_OPTIONS: JSON.stringify({ experimentalZoneless: false })
      }
    });
  },
  docs: {
    autodocs: true
  },
};

export default config;
