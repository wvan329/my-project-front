import { createPinia } from "pinia"
import router from "./router"
import { nextTick } from "vue"

import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import "@/styles/index.css"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import useUserStore from "@/stores/user"
let userStore
nextTick(() => {
  userStore = useUserStore()
})

export default {
  install(app) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    app.use(createPinia())
    app.use(router)
    app.use(ElementPlus, {
      locale: zhCn
    })
    app.directive("has", {
      //全局使用v-has指令的组件挂载完毕会自动执行
      //el就是这个元素
      //binding就是这个元素绑定的参数
      mounted(el, binding) {
        console.log(binding);
        
        if (!userStore.user.permissions.includes(binding.value)) {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}
