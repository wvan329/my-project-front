import { fileURLToPath, URL } from "node:url"

import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 读取对应环境的 env 文件（mode 会是 'development' 或 'production'）
  const env = loadEnv(mode, process.cwd())
  const proxy = "/" + env.VITE_APP_NAME + "-api"

  return {
    base: "/" + env.VITE_APP_NAME + "/",
    plugins: [vue(), vueDevTools(), tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variable.scss" as *;`
        }
      }
    },
    server: {
      proxy: {
        [proxy]: {
          target: env.VITE_SERVER, // 你的后端地址（或容器地址）
          changeOrigin: true,
          ws: true, // ✅ 开启 WebSocket 代理
          // rewrite: (path) => path.replace(/^\/zuqiu-api/, ""),
          rewrite: (path) => {
            if (mode === "development") {
              return path.replace(new RegExp("^" + proxy), "")
            }
            return path
          }
        }
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }
  }
})
