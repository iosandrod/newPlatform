import { createRouter, createWebHashHistory } from 'vue-router';
import { shallowReactive } from 'vue';
import routes from './routes';

const router = createRouter(
  shallowReactive({
    history: createWebHashHistory(),
    routes,
  })
);

// 注册导航守卫

export default router;
