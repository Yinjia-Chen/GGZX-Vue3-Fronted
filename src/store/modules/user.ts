// 创建用户相关的小仓库
import { defineStore } from 'pinia';
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type';

import type { UserState } from './types/type';
// 引入操作本地存储的工具文件
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token';
// 引入路由（常量路由）
import { constantRoute } from '@/router/routes';
let useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户的唯一标识token
      menuRoutes: constantRoute, // 仓库存储生成菜单需要的数据 =》路由
      username: '',
      avatar: '',
    };
  },
  // 异步｜逻辑的地方
  actions: {
    // 用户登陆的方法
    async userLogin(data: loginFormData) {
      // 登陆请求
      let result: loginResponseData = await reqLogin(data);
      // 成功200 -> token，并存储
      if (result.code === 200) {
        // pinia仓库存储token
        // pinia｜vuex存储数据利用js对象
        this.token = result.data as string;
        // 本地存储持久化存储一份
        SET_TOKEN(result.data as string);
        // 保证当前async函数返回一个成功的promise
        return 'ok';
      } else {
        return Promise.reject(new Error(result.data));
      }
      // 失败201 -> 登陆失败错误信息
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户信息 存储到仓库中【头像、名字】
      let result: userInfoResponseData = await reqUserInfo();
      // 如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    // 退出登陆
    async userLogout() {
      // 退出登陆请求
      let result: any = await reqLogout();
      if (result.code === 200) {
        // 目前没有mock接口：退出登陆接口（通知服务器本地用户唯一标识失效）
        this.token = '';
        this.username = '';
        this.avatar = '';
        REMOVE_TOKEN();
        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
  },
  // 计算属性
  getters: {},
});

// 对外暴露获取小仓库的方法
export default useUserStore;
