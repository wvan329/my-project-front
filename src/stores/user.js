import { ref, computed, watch } from "vue"
import { defineStore } from "pinia"
import { login, logout } from "@/api/user"
import router from "@/router"
import { ElNotification } from "element-plus"

export default defineStore("user", () => {
  let user = ref(JSON.parse(localStorage.getItem(import.meta.env.VITE_APP_NAME + "-user")))
  watch(user, (newVal, oldVal) => {
    localStorage.setItem(import.meta.env.VITE_APP_NAME + "-user", JSON.stringify(newVal))
  })

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
  watch(isDark, (newVal, oldVal) => {
    localStorage.setItem("isDark", newVal)
    if (newVal) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  })

  // const doubleCount = computed(() => count.value * 2)
  const userLogin = async (data) => {
    user.value = await login(data)
  }

  const userLogout = async () => {
    await logout()
    user.value = ""
    // ElNotification({ title: "退出成功", type: "success", duration: 700 })
    router.push({
      path: "/login",
      query: {
        redirect: router.currentRoute.value.path
      }
    })
  }

  return { userLogin, userLogout, user, isDark }
})
