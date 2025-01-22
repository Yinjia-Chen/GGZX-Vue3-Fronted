import { createApp } from 'vue'
import App from './App.vue'

// 获取应用实例对象
const app = createApp(App)

// 使用element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 注册element-plus
app.use(ElementPlus, {
  locale: zhCn,
})

// Svg 依赖插件配置
import 'virtual:svg-icons-register'

// 引入自定义插件对象：注册整个项目全局对象
import globalComponent from '@/components/index.ts'
// 安装自定义插件
app.use(globalComponent)

// 引入模板的全局样式
import '@/styles/index.scss'

// // mock测试代码：测试虚拟接口
// import axios from 'axios'
// // 登录接口
// axios({
//   url: '/api/user/login',
//   method: 'post', // 请求方式
//   data: {
//     username: 'admin',
//     password: '111111',
//   },
// })

// 挂载应用实例对象
app.mount('#app')
