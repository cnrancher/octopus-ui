import Vue from 'vue';
import VueRouter from 'vue-router';
import Setting from '../views/Setting.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Setting',
    component: Setting,
  },
  {
    path: '/device',
    name: 'Device',
    component: () => import('../views/Device.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
