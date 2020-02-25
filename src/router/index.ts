import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Login from '@/views/login.vue';
import Setting from '@/views/setting.vue';
import Layout from '@/layout/index.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/setting',
    children: [
      {
        path: 'setting',
        component: Setting,
        name: 'Setting',
      },
    ],
  },
  {
    path: '/',
    component: Layout,
    redirect: '/device',
    children: [
      {
        path: 'device',
        component: () => import('@/views/device.vue'),
        name: 'Device',
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
