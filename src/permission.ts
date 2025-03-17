// 路由鉴权 路由访问权限设置
import router from './router';
import nprogress from 'nprogress';
import setting from './setting';
// 引入进度条样式
import 'nprogress/nprogress.css';
nprogress.configure({ showSpinner: false }); // 去除页面加载条右侧加载圈圈
// 获取用户相关的小仓库内部token数据，判断用户是否登陆成功
import useUserStore from './store/modules/user';
import pinia from './store';
let userStore = useUserStore(pinia);
console.log(userStore);

// 全局守卫：项目中任意路由切换都会触发的钩子
// 全局前置守卫：访问某个路由之前的守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`;
  // to：将要访问的路由
  // from：从哪个路由而来
  // next：路由的放行函数
  nprogress.start();
  // 获取token，判断用户是否登陆
  let token = userStore.token;
  // 获取用户名字
  let username = userStore.username;
  if (token) {
    // 用户登陆成功
    if (to.path == '/login') {
      // 登陆成功后禁用login路由
      next({ path: '/' });
    } else {
      // 有用户信息
      if (username) {
        // 放行
        next();
      } else {
        // 没有用户信息，在守卫发请求获取到了用户信息再放行
        try {
          // 获取用户信息
          await userStore.userInfo();
          // 放行
          next();
        } catch (error) {
          // token过期：获取不到用户信息了
          // 用户手动修改本地存储的token
          // 退出登陆->用户相关数据清空
          await userStore.userLogout();
          next({ path: '/login', query: { redirect: to.path } });
        }
      }
    }
  } else {
    // 用户登陆失败
    if (to.path == '/login') {
      next();
    } else {
      next({ path: '/login', query: { redirect: to.path } });
    }
  }
});
// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done();
});

// 问题一：任意路由切换实现进度条业务 --nprogress
// 问题二：路由鉴权
// 全部路由组件：登陆｜404｜任意路由｜首页｜数据大屏｜权限管理(三个子路由)｜商品管理(四个子路由)

// 用户未登陆：用户只能访问login，其余路由访问指向login
// 用户登陆成功：不可访问login，访问login时指向home
