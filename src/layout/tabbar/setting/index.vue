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
    src="../../../public/logo.png"
    style="width: 24px; height: 24px; margin: 0px 10px"
  />
  <!-- 下拉菜单：退出登陆 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      Admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// 获取骨架的仓库
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
// 刷新按钮点击的回调
const updateRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}

// 全屏按钮点击的回调
const fullScreen = () => {
  // dom对象的一个属性：可以用来判断当前是否全屏的模式，全屏返回true，否则返回null
  let full = document.fullscreenElement
  // 切换全屏模式
  if (!full) {
    // 文档根节点的方法 requestFullscreen 实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏模式
    document.exitFullscreen()
  }
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
