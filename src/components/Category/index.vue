<template>
  <div>
    <el-card style="width: 100%">
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select
            v-model="categoryStore.c1Id"
            placeholder="请选择"
            clearable
            style="width: 120px"
            :disabled="scene == 1"
            @change="selectC1"
          >
            <el-option v-for="(c1, index) in categoryStore.c1Arr" :label="c1.name" :value="c1.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="categoryStore.c2Id"
            placeholder="请选择"
            clearable
            style="width: 120px"
            :disabled="scene == 1"
            @change="selectC2"
          >
            <el-option v-for="(c2, index) in categoryStore.c2Arr" :label="c2.name" :value="c2.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="categoryStore.c3Id"
            placeholder="请选择"
            clearable
            style="width: 120px"
            :disabled="scene == 1"
          >
            <el-option v-for="(c3, index) in categoryStore.c3Arr" :label="c3.name" :value="c3.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
// 引入并使用三级分类数据仓库
import useCategoryState from '@/store/modules/category';
let categoryStore = useCategoryState();

// 当组件挂载完毕,通知仓库发送请求获取数据
onMounted(() => {
  categoryStore.getC1();
});

// 选好一级分类之后，触发事件，发请求，获取二级分类数据
const selectC1 = () => {
  categoryStore.getC2();
  // 清空二、三级分类的数据
  categoryStore.c2Arr = [];
  categoryStore.c2Id = '';
  categoryStore.c3Arr = [];
  categoryStore.c3Id = '';
};
// 选好二级分类之后，触发事件，发请求，获取三级分类数据
const selectC2 = () => {
  categoryStore.getC3();
  // 清空三级分类的数据
  categoryStore.c3Arr = [];
  categoryStore.c3Id = '';
};

// 接收父组件传入的scene
defineProps(['scene']);
</script>

<style></style>
