// 通过 vue-router 实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
// 引入常量路由
import { constantRoute } from './routes'

// 创建路由器
let router = createRouter({
  // 路由模式 hash
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
