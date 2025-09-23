<template>
  <div class="flex h-screen">
    <!-- <el-button @click="console.log(router)"></el-button> -->
     <!-- 左 -->
    <div class="z-1 flex flex-col shadow-[4px_0_3px_rgba(0,0,0,0.6)] duration-200" :class="[isCollapse ? 'w-[64px]' : 'w-[260px]']">
      <!-- 左上 -->
      <div
        @click="isCollapse = !isCollapse"
        class="sticky top-0 flex h-[50px] shrink-0 cursor-pointer items-center justify-center bg-sky-700 dark:bg-sky-900"
      >
        <img class="size-[32px] object-cover align-top" src="/lanqiu.png" alt="" />
        <transition enter-active-class="transition-opacity duration-1000" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <h1 v-if="!isCollapse" class="ml-3 font-bold text-white">{{ title }}</h1>
        </transition>
      </div>
      <!-- 左下 -->
      <el-scrollbar class="flex-1 dark:bg-black">
        <el-menu
          :class="{ 'is-collapse': isCollapse }"
          class="border-none dark:bg-black dark:text-white"
          router
          :collapse="isCollapse"
          show="false"
          :default-active="router.currentRoute.value.path"
        >
          <Menu :isCollapse="isCollapse" :list="router.options.routes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 右 -->
    <div class="flex flex-1 flex-col overflow-auto">
      <!-- 右上 -->
      <div class="sticky top-0 flex h-[50px] shrink-0 items-center justify-between bg-sky-700 px-5 dark:bg-sky-900">
        <!-- 左 -->
        <div class="flex items-center">
          <el-icon class="mr-2 text-white">
            <expand v-if="isCollapse" />
            <fold v-else />
          </el-icon>
          <el-breadcrumb separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: item.path }" v-for="item in router.currentRoute.value.matched.filter((r) => r.children.length !== 1)">
              <div class="flex items-center">
                <!-- <el-icon><component :is="item.meta.icon"></component></el-icon> -->
                <span class="font-normal">{{ item.meta.title }}</span>
              </div>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 右 -->
        <div class="flex items-center gap-x-2">
          <!-- <el-button class="m-0" circle icon="refresh" /> -->
          <el-button class="m-0" @click="toggleFullscreen" circle icon="FullScreen" />
          <!-- <el-button class="m-0" circle icon="setting" /> -->

          <el-switch
            class="w-10"
            v-model="userStore.isDark"
            active-action-icon="moon"
            style="--el-switch-on-color: black; --el-switch-off-color: grey"
            inactive-action-icon="sunny"
            inline-prompt
          />

          <div class="flex cursor-pointer gap-x-2" @click="clickDropdown">
            <img class="size-[32px] rounded-full object-cover" src="@/assets/b.jpg" alt="" />
            <el-dropdown id="dropdown" trigger="click" :hide-on-click="true">
              <span class="el-dropdown-link flex items-center">
                <span class="font-bold">{{ userStore.user.username }}</span>
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="userStore.userLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <!-- 右下 -->
      <div class="flex-1 p-5 dark:bg-black">
        <Main class="dark:text-white"></Main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import router from "@/router"
import Menu from "./menu.vue"
import Main from "./main.vue"
import useUserStore from "@/stores/user"
const userStore = useUserStore()

const title = import.meta.env.VITE_APP_TITLE
const clickDropdown = () => {
  document.querySelector("#dropdown").click()
}

let isCollapse = ref(false)
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    // 进入全屏（整页）
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
</script>

<style>
@import "@/styles/index.css";
.el-breadcrumb__inner {
  color: white !important;
}
.el-icon.el-breadcrumb__separator {
  @apply text-white;
}
.el-dropdown-link.el-tooltip__trigger.el-tooltip__trigger {
  @apply text-white;
}
.dark .el-menu.el-menu--inline {
  @apply bg-black;
}

.dark .el-menu-item,
.dark .el-sub-menu__title {
  @apply text-white;
}
.el-dropdown-menu__item {
  color: black !important;
}
.el-dropdown-menu__item:hover {
  background-color: oklch(92.8% 0.006 264.531) !important;
}
</style>
