<template>
  <!-- 三级分类 注册为 全局组件 -> SPU页面也使用 -->
  <Category :scene="scene"></Category>

  <el-card style="width: 100%; margin-top: 10px">
    <!-- 展示属性页面 -->
    <div v-show="scene == 0">
      <el-button icon="Plus" type="primary" :disabled="categoryState.c3Id ? false : true" @click="addAttr">
        添加属性
      </el-button>
      <el-table border style="margin-top: 10px" :data="attrArr">
        <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150px"></el-table-column>
        <el-table-column label="属性值名称">
          <template #="{ row, $index }">
            <el-tag type="primary" v-for="(item, index) in row.attrValueList" :key="item.id" style="margin: 10px">
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Edit" @click="editAttr(row)"></el-button>
            <el-popconfirm :title="`确定要删除${row.attrName}吗？`" @confirm="removeAttr(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加属性页面 -->
    <div v-show="scene == 1">
      <el-form>
        <el-form-item label="属性名称" style="width: 500px">
          <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="attrParams.attrName ? false : true" @click="addAttrValue">
            添加属性值
          </el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
        <el-form-item>
          <el-table border :data="attrParams.attrValueList">
            <el-table-column type="index" label="序号" width="120px" align="center"></el-table-column>
            <el-table-column label="属性值名称">
              <template #="{ row, $index }">
                <el-input
                  placeholder="请输入属性值"
                  :ref="(vc: any) => (inputArr[$index] = vc)"
                  v-if="row.flag"
                  v-model="row.valueName"
                  autofocus
                  @blur="whenBlur(row, $index)"
                ></el-input>
                <div v-else @click="needEdit(row, $index)">{{ row.valueName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="属性值操作"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" disabled="" @click="save">保存</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, reactive, nextTick } from 'vue';

// 引入三级分类仓库
import useCategoryState from '@/store/modules/category';
import { reqHasAttr, reqDeleteAttr, reqSaveAttr } from '@/api/product/attr';
import { ElMessage } from 'element-plus';
const categoryState = useCategoryState();

// 展示 & 添加/修改 属性切换
let scene = ref<number>(0);

// 存储el-input新增属性的组件实例对象
let inputArr = ref<any>([]);

// 定义获取到的数据
let attrArr = ref<any>([]);
//收集新增的属性的数据
let attrParams = reactive<any>({
  attrName: '', //新增的属性的名字
  attrValueList: [
    //新增的属性值数组
  ],
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //代表的是三级分类
});

// 获取已有属性名
const getAttr = async () => {
  // 解构出仓库中的id
  const { c1Id, c2Id, c3Id } = categoryState;
  // 发请求获取数据
  let result: any = await reqHasAttr(c1Id, c2Id, c3Id);
  if (result.code == 200) {
    attrArr.value = result.data;
  }
};
// 监听数据变化
watch(
  () => categoryState.c3Id,
  () => {
    // 每次c3id变化,先清空已有数据
    attrArr.value = [];
    // 没拿到c3的id数据,不操作,直接返回
    if (!categoryState.c3Id) return;
    getAttr();
  },
);

// 添加属性的回调
const addAttr = () => {
  // 清空已有的数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryState.c3Id,
    categoryLevel: 3,
  });
  scene.value = 1;
};

// 添加属性值按钮的回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 添加新属性默认展示input而非div
  });
  // 自动聚焦在新增的input框上
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  });
};

// 保存按钮的回调
const save = async () => {
  let result: any = await reqSaveAttr(attrParams);
  if (result.code == 200) {
    // 切换场景
    scene.value = 0;
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    });
    // 获取已有属性和属性值，重新展示
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    });
  }
};

// 取消按钮的回调
const cancel = () => {
  scene.value = 0;
};

// 删除属性的回调
const removeAttr = async (attrId: any) => {
  let result: any = await reqDeleteAttr(attrId);
  console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    });
  }
};

// el-input属性失焦触发
const whenBlur = (row: any, $index: any) => {
  // 非法情况1:属性值为空
  if (row.valueName.trim() == '') {
    // 删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: 'error',
      message: '属性值不可为空',
    });
    return;
  }

  // 非法情况2:属性值重复
  let repeat = attrParams.attrValueList.find((item: any) => {
    if (item != row) {
      return item.valueName === row.valueName;
    }
  });
  if (repeat) {
    // 去除重复的属性值
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: 'error',
      message: '属性值不可重复',
    });
    return;
  }
  row.flag = false;
};

// el-input失焦后再点击触发
const needEdit = (row: any, $index: any) => {
  // 销毁div，展示input
  row.flag = true;
  // 自动聚焦
  nextTick(() => {
    inputArr.value[$index].focus();
  });
};

// 修改已有属性
const editAttr = (row: any) => {
  // 切换场景
  scene.value = 1;
  // 展示已有属性 & 属性值
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
};
</script>

<style scoped></style>
