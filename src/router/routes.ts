import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/demo', component: () => import('pages/test/Demo.vue') },
      { path: '/pms', redirect: '/pms/product' },
      { path: '/pms/product', component: () => import('pages/pms/product/Index.vue') },
      { path: '/pms/product/add', component: () => import('pages/pms/product/Add.vue') },
      { path: '/pms/product/update', component: () => import('pages/pms/product/Update.vue') },
      { path: '/pms/category', component: () => import('pages/pms/category/Index.vue') },
      { path: '/pms/category/add', component: () => import('pages/pms/category/Add.vue') },
      { path: '/pms/category/update', component: () => import('pages/pms/category/Update.vue') },
      { path: '/pms/brand', component: () => import('pages/pms/brand/Index.vue') },
      { path: '/pms/brand/add', component: () => import('pages/pms/brand/Add.vue') },
      { path: '/pms/brand/update', component: () => import('pages/pms/brand/Update.vue') },
      { path: '/pms/attr-cate', component: () => import('pages/pms/attr/Index.vue') },
      { path: '/pms/attr', component: () => import('pages/pms/attr/AttrList.vue') },
      { path: '/pms/attr/add', component: () => import('pages/pms/attr/AddAttr.vue') },
      { path: '/pms/attr/update', component: () => import('pages/pms/attr/UpdateAttr.vue') }
    ]
  },
  { path: '/login', component: () => import('pages/login/Index.vue') },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
