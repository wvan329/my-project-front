<template>
  <div class="flex h-screen bg-[url(@/assets/login.png)] bg-cover bg-right bg-no-repeat">
    <el-form
      ref="formRef"
      :rules="rules"
      :model="loginForm"
      class="relative m-auto flex h-3/5 w-4/5 flex-col items-center justify-around rounded-3xl bg-white/40 p-5 shadow-xl sm:w-3/5 md:w-3/8 lg:right-[8%]"
    >
      <h1 class="text-3xl font-bold opacity-70">{{ title }}</h1>
      <el-form-item class="m-0 w-3/4" prop="username">
        <el-input prefix-icon="User" v-model="loginForm.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item class="m-0 w-3/4" prop="password">
        <el-input prefix-icon="Lock" v-model="loginForm.password" show-password type="password" placeholder="请输入密码"></el-input>
      </el-form-item>

      <div class="flex items-center justify-center">
        <img :src="captcha?.img" class="h-full w-2/5" alt="" @click="flushCaptcha" />
        <el-form-item prop="captcha" class="m-0 ml-2 h-full w-2/5">
          <el-input prefix-icon="Menu" @keyup.enter="login" v-model="loginForm.captcha" class="h-full" placeholder="验证码"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="m-0 w-3/4">
        <el-button class="w-full" type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import useUserStore from "@/stores/user"
import { getCaptcha } from "@/api/user"
import router from "@/router"
import { ElNotification } from "element-plus"
const title = import.meta.env.VITE_APP_TITLE

const userStore = useUserStore()
if (userStore.user) {
  // todo打开这行代码
  router.push("/")
}
const loginForm = reactive({ username: "wgk123", password: "123456", captchaId: "", captcha: "" })
// const loginForm = reactive({ username: "", password: "", captchaId: "", captcha: "" })
let captcha = ref()
const flushCaptcha = async () => {
  captcha.value = await getCaptcha()
  loginForm.captchaId = captcha.value.captchaId
}
flushCaptcha()
const login = async () => {
  // formRef.value.resetFields()
  await formRef.value.validate()

  try {
    await userStore.userLogin(loginForm)
  } catch (e) {
    flushCaptcha()
    loginForm.captcha = ""
    return
  }
  // ElNotification({ title: "登录成功", type: "success", duration: 700 })
  router.push(router.currentRoute.value.query.redirect || "/")
}

const validateCaptcha = (rule, value, callback) => {
  if (!/^[0-9a-zA-Z]{4}$/.test(value)) {
    callback(new Error("长度4位"))
  }
  callback()
}

const rules = reactive({
  username: [
    { required: true, message: "请输入账号", trigger: "change" },
    { min: 4, max: 16, message: "长度4-16位", trigger: "change" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "change" },
    { min: 6, max: 16, message: "长度6-16位", trigger: "change" }
  ],
  captcha: [{ validator: validateCaptcha, trigger: "change" }]
})

const formRef = ref()
</script>

<style>
@import "@/styles/index.css";
/* :deep(.el-input__inner) {
  @apply placeholder:text-sky-500;
} */
</style>
