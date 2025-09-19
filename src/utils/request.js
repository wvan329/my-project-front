import axios from "axios"
import { ElMessage } from "element-plus"
import useUserStore from "@/stores/user"
import router from "@/router"
import { nextTick } from "vue"

const request = axios.create({
  baseURL: "/" + import.meta.env.VITE_APP_NAME + "-api",
  timeout: 5000
})

let userStore
nextTick(() => {
  userStore = useUserStore()
})

// Add a request interceptor
request.interceptors.request.use((config) => {
  if (userStore.user) {
    config.headers["satoken-" + import.meta.env.VITE_APP_NAME] = userStore.user.token
  }
  return config
})

// Add a response interceptor
//http响应状态码是2xx默认走成功拦截器，状态码不是2xx则走失败拦截器
//但是根据响应体里的状态码来判断
request.interceptors.response.use(
  (response) => {
    if (response.data.code !== 200) {
      ElMessage({
        message: response.data.msg,
        type: "error"
      })
      if (response.data.msg === "未登录") {
        userStore.user = ""
        router.push("/login")
      }
      return Promise.reject(error)
    }
    return response.data.data
  },
  (error) => {
    ElMessage({
      message: "服务器异常",
      type: "error"
    })
    return Promise.reject(error)
  }
)

export default request
