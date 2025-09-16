import { createPinia } from "pinia"
import router from "./router"

import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import "@/styles/index.css"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"

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
  }
}
