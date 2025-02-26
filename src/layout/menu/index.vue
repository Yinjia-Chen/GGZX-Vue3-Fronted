<template>
  <div>
    <template v-for="(item, index) in menuList" :key="item.path">
      <!-- 不存在子路由 -->
      <template v-if="!item.children">
        <el-menu-item
          :index="item.path"
          v-if="!item.meta.hidden"
          @click="goRoute"
        >
          <template #title>
            <span>
              <el-icon>
                <component :is="item.meta.icon"></component>
              </el-icon>
            </span>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 存在一个子路由 -->
      <template v-if="item.children && item.children.length == 1">
        <el-menu-item
          v-if="!item.children[0].meta.hidden"
          :index="item.children[0].path"
        >
          <template #title>
            <el-icon>
              <component :is="item.children[0].meta.icon"></component>
            </el-icon>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 存在多个子路由 -->
      <el-sub-menu
        :index="item.path"
        v-if="item.children && item.children.length > 1"
      >
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <!-- 递归实现 -->
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
// 获取父组件传递过来的全部路由数组
defineProps(['menuList'])

// 点击菜单的回调
const goRoute = (vc: any) => {
  console.log(vc.index)
}
</script>

<!-- 出现两个script标签时，需声明使用相同语言 -->
<script lang="ts">
// 递归组件一定要取名
export default {
  name: 'Menu',
}
</script>

<style scoped></style>
