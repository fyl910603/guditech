import { resolve } from 'path';

// ref: https://umijs.org/config/
export default {
  targets: {
    chrome: 49,
    firefox: 45,
    safari: 10,
    edge: 13,
    ie: 11,
  },
  hash: true,
  // exportStatic: true,
  alias: {
    components: resolve(__dirname, './src/components'),
    utils: resolve(__dirname, './src/utils'),
  },
  theme: {
    '@primary-color': '#55c1de', //'#1DA57A',
  },
  proxy: {
    '/api': {
      target: 'https://test.guditech.com',
      changeOrigin: true,
    },
  },
  base: '/smsweb/',
  publicPath: '/smsweb/',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          immer: true,
        },
        dynamicImport: true,
        title: '古迪效果通',
        dll: false,
        routes: {
          exclude: [],
        },
        hardSource: false,
      },
    ],
  ],
};
