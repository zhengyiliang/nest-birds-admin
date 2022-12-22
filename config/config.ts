import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: '',
  },
  layout: {
    title: '正好有时间-后台管理',
    favicons: ['@/favicon.ico'],
  },
  routes,
  npmClient: 'pnpm',
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:3000/',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
});
