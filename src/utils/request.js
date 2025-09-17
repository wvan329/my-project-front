import axios from "axios"
import { ElMessage } from "element-plus"
import useUserStore from "@/stores/user"
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})

// Add a request interceptor
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers["satoken--替换1"] = userStore.token
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
        const userStore = useUserStore()
        userStore.token = null
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
