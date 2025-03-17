<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <!-- 登陆按钮 -->
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              size="default"
              class="login_btn"
              @click="login"
            >
              登陆
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 引入输入框前缀图标
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
// 引入获取当前时间段的函数
import { getTime } from '@/utils/time'
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user.ts'
let useStore = useUserStore()
// 获取el-form组件
let loginForms = ref()
// 获取路由器
let $router = useRouter()
// 获取路由对象
let $route = useRoute()
// 定义变量控制按钮加载效果
let loading = ref(false)
// 收集账号与密码的数据
let loginForm = reactive({ username: 'admin', password: '111111' })
// 登陆按钮回调
const login = async () => {
  // 保证全部表单校验通过 才发请求
  await loginForms.value.validate()
  // 加载效果：开始加载
  loading.value = true
  // 点击登陆按钮以后
  // 1.通知仓库发登陆请求
  // （1）请求成功 -> 首页展示数据的地方
  // （2）请求失败 -> 弹出登陆失败信息
  try {
    // 保证登陆成功
    await useStore.userLogin(loginForm)
    // 编程式导航跳转到展示首页
    // 判断登陆的时候，路由路径当中是否有query参数，若有则往query参数跳转
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 登陆成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
    })
    // 登陆成功，加载效果消失
    loading.value = false
  } catch (error) {
    // 登陆失败，加载效果消失
    loading.value = false
    // 登陆失败提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
// 自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  // rule：即为校验规则对象
  // value：即为表单元素的文本内容
  // callback：如果符合条件(可写正则)，callback放行通过
  //           如果不符合条件，callback注入错误提示信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少为五位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少为六位'))
  }
}
// 定义表单需要校验的配置对象
const rules = {
  // 检测对象属性：
  // required：true代表字段必须要求校验
  // min：代表文本长度至少多少位
  // message：错误的提示信息
  // trigger：触发校验的时机   change->文本变化时校验，blur->表单为空时校验
  username: [
    // {
    //   required: true,
    //   min: 6,
    //   max: 10,
    //   message: '用户名长度在6-10位之间',
    //   trigger: 'change',
    // },
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    // {
    //   required: true,
    //   min: 6,
    //   max: 15,
    //   message: '密码长度在6-15位之间',
    //   trigger: 'change',
    // },
    { trigger: 'change', validator: validatorPassword },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}
.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    font-size: 20px;
    color: white;
    margin: 20px 0px;
  }

  .login_btn {
    width: 100%;
  }
}
</style>
