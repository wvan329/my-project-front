import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/-替换1/",
  plugins: [vue(), vueDevTools(), tailwindcss()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variable.scss" as *;`,
      },
    },
  },
  server: {
    proxy: {
      '/-替换1-api': {
        target: "http://localhost:8080", // 你的后端地址（或容器地址）
        changeOrigin: true,
        ws: true, // ✅ 开启 WebSocket 代理
        rewrite: (path) => path.replace(/^\/-替换1-api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
