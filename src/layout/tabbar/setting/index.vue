<template>
  <!-- 刷新按钮 -->
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <!-- 全屏按钮 -->
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <!-- 设置按钮 -->
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />
  <!-- 下拉菜单：退出登陆 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import useUserStore from '@/store/modules/user';
import useLayOutSettingStore from '@/store/modules/setting';
// 获取骨架的仓库
let LayOutSettingStore = useLayOutSettingStore();
// 获取用户相关的小仓库
let userStore = useUserStore();
// 获取路由器对象
let $router = useRouter();
// 获取路由对象
let $route = useRoute();
// 刷新按钮点击的回调
const updateRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh;
};

// 全屏按钮点击的回调
const fullScreen = () => {
  // dom对象的一个属性：可以用来判断当前是否全屏的模式，全屏返回true，否则返回null
  let full = document.fullscreenElement;
  // 切换全屏模式
  if (!full) {
    // 文档根节点的方法 requestFullscreen 实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //退出全屏模式
    document.exitFullscreen();
  }
};

// 退出登陆点击的回调
const logout = async () => {
  // 第一件事：需要向服务器发请求【退出登陆的接口】 => 本次登陆token无效，需要销毁
  // 第二件事：仓库中关于用户相关的数据清空【token｜username｜avatar】
  // 第三件事：跳转到登陆页面
  await userStore.userLogout();
  $router.push({ path: '/login', query: { redirect: $route.path } });
};
</script>

<script lang="ts">
export default {
  name: 'Setting',
};
</script>

<style scoped></style>
