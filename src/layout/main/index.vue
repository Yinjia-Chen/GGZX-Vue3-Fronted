<template>
  <div>
    <!-- 路由组件出口的位置 -->
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <!-- 渲染layout一级路由组件的子路由 -->
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()

// 控制当前组件是否销毁重建
let flag = ref(true)

// 监听仓库内部refresh数据是否变化，发生变化则用户点击过刷新按钮
watch(
  () => LayOutSettingStore.refresh,
  () => {
    // 点击刷新按钮，销毁路由组件
    flag.value = false
    // 当新的（已销毁）DOM已经渲染更新完毕，进入nextTick语句
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
