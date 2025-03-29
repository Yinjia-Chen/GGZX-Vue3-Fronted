<template>
  <el-card class="bpx-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" icon="Plus" @click="addTradeMark">添加品牌</el-button>
    <!-- 表格组件：用于展示已有的平台数据 -->
    <!-- 
         table
         ---border:表格纵向边框
         table-column
         ---label:列的标题
         ---width:列的宽度
         ---align:对齐方式
     -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="品牌名称">
        <template #="{ row, $index }">
          <pre style="color: brown">{{ row.tmName }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row, $index }">
          <img :src="row.logoURL" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="edit(row)"></el-button>
          <el-popconfirm title="确定要删除吗？" @confirm="deleteTm(row)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件
         pagination
            v-model:current-page:设置分页器当前页码 
            v-model:page-size:设置每页展示数据的条数
            page-sizes:设置下拉菜单的数据
            background:设置分页器按钮的背景颜色
            layout:设置分页器六个子组件布局的调整
    -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="getHasTrademark"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    />
  </el-card>
  <!-- 添加品牌对话框 -->
  <el-dialog v-model="scene" :title="tmParams.id ? '修改品牌' : '添加品牌'">
    <!-- 提交校验表单 -->
    <el-form style="width: 80%; margin-top: 10px" :rules="rules" :model="tmParams" ref="ruleFormRef">
      <!-- 品牌名称 -->
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input v-model="tmParams.tmName" placeholder="请输入品牌名称" />
      </el-form-item>
      <!-- 品牌logo -->
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          v-model="tmParams.logoUrl"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="tmParams.logoUrl" :src="tmParams.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 尾部具名插槽 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="save">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 引入组合式API函数ref
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqHasTrademark, AddOrUpdateTradeMark, reqRemoveTm } from '@/api/product/trademark/index.ts';
// 引入ts类型
import { Records, TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type.ts';
import { ElMessage } from 'element-plus';
import type { UploadProps } from 'element-plus';
// 当前页码
let pageNo = ref<number>(1);
// 每页展示多少条数据
let limit = ref<number>(3);
// 存储已有品牌的数据总数
let total = ref<number>(0);
// 存储已有品牌的数据
let trademarkArr = ref<Records>([]);
// 对话框场景展示,false时不展示
let scene = ref<boolean>(false);
// 收集新增品牌数据
let tmParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
});
// 获取表单实例对象
const ruleFormRef = ref();

// 获取已有品牌的接口封装为一个函数:在任何情况下调用函数即可获取数据
const getHasTrademark = async (pager = 1) => {
  // 当前页码，未注入参数时，每次调用，默认pager=1，即挂载完毕&修改下拉菜单时，回到第一页，修改页码会注入参数pager
  pageNo.value = pager;
  let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value);
  if (result.code === 200) {
    // 存储已有品牌的总个数
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
  }
};

// 自定义表单校验规则 tmName value表单元素内容 callback()调用放行
const validatorTmName = (rule: any, value: any, callBack: any) => {
  //是当表单元素触发blur时候,会触发此方法
  //自定义校验规则
  if (value.trim().length >= 2) {
    callBack();
  } else {
    //校验未通过返回的错误的提示信息
    callBack(new Error('品牌名称位数大于等于两位'));
  }
};
// 自定义表单校验规则 logoUrl
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback();
  } else {
    callback(new Error('LOGO图片务必上传'));
  }
};
// 表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
};
// 图片上传前的校验钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('必须上传img/jpg文件格式的图片');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不可超过2MB');
    return false;
  }
  return true;
};
// 图片上传成功后回调展示图片
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // response:上传成功后服务器返回的数据
  tmParams.logoUrl = response.data;
  // 上传成功清空校验结果
};
// 点击添加品牌按钮的回调
const addTradeMark = () => {
  // 场景切换，展示对话框
  scene.value = true;
  // 清空对话框内容
  tmParams.logoUrl = '';
  tmParams.tmName = '';
  // 清空校验结果
  nextTick(() => {
    ruleFormRef.value.clearValidate('logoUrl');
    ruleFormRef.value.clearValidate('tmName');
  });
};

// 保存按钮回调
const save = async () => {
  // 校验整个表单
  await ruleFormRef.value.validate();
  // 发请求传数据
  let result: any = await AddOrUpdateTradeMark(tmParams);
  console.log(result);
  if (result.code == 200) {
    // 隐藏对话框
    scene.value = false;
    ElMessage({
      type: 'success',
      message: tmParams.id ? '修改成功' : '添加成功',
    });
    // 添加成功,重新获取已有品牌
    getHasTrademark(tmParams.id ? pageNo.value : 1);
  } else {
    ElMessage({
      type: 'error',
      message: tmParams.id ? '修改失败' : '添加失败',
    });
    scene.value = false;
  }
};
// 取消按钮回调
const cancel = () => {
  // 隐藏对话框
  scene.value = false;
};

// 编辑按钮回调
const edit = (row: TradeMark) => {
  // 展示对话框
  scene.value = true;
  // 获取目标对象的id,tmName,logoUrl并存入tmParams
  // row:当前操作的已有品牌
  // es6语法,合并对象
  Object.assign(tmParams, row);
  // 清空上一次的表单校验结果
  nextTick(() => {
    ruleFormRef.value.clearValidate('logoUrl');
    ruleFormRef.value.clearValidate('tmName');
  });
};

// 删除按钮回调
const deleteTm = async (row: TradeMark) => {
  let result = await reqRemoveTm(row.id);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    });
  }
};

// 组件挂载完毕钩子---发一次请求，获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark();
});

// 下拉菜单发生变化触发事件
const sizeChange = () => {
  getHasTrademark(pageNo.value - 1);
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
