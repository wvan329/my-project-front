import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { login } from "@/api/user"
import router from "@/router"
import { ElNotification } from "element-plus"

export default defineStore("user", () => {
  let token = ref(localStorage.getItem(import.meta.env.VITE_APP_TOKEN_NAME))
  let isDark = ref(JSON.parse(localStorage.getItem("isDark")))
  if (isDark.value) {
    document.documentElement.classList.add("dark")
  } else {
    if (isDark.value === false) {
      document.documentElement.classList.remove("dark")
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark")
        isDark.value = true
      }
    }
  }
  // const doubleCount = computed(() => count.value * 2)
  const userLogin = async (data) => {
    token.value = (await login(data)).token
    localStorage.setItem(import.meta.env.VITE_APP_TOKEN_NAME, token.value)
  }

  const userLogout = () => {
    token.value = null
    localStorage.removeItem(import.meta.env.VITE_APP_TOKEN_NAME, token.value)
    // ElNotification({ title: "退出成功", type: "success", duration: 700 })
    router.push("/login")
  }

  const toggleDark = () => {
    localStorage.setItem("isDark", isDark.value)
    if (isDark.value) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return { userLogin, userLogout, token, isDark, toggleDark }
})
