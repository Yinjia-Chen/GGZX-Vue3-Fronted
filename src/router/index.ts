// 通过 vue-router 实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'

// 创建路由器
let router = createRouter({
  // 路由模式 hash
  history: createWebHashHistory(),
  routes: [
    // 登录
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      name: 'login', // 命名路由
    },
    // 登录成功后的主页
    {
      path: '/',
      component: () => import('@/views/home/index.vue'),
      name: 'layout',
    },
    {
      path: '/404',
      component: () => import('@/views/404/index.vue'),
      name: '404',
    },
  ],
})

export default router
