<template>
  <div class="flex h-screen">
    <!-- <el-button @click="console.log(router)"></el-button> -->
    <div class="z-1 flex flex-col shadow-[4px_0_3px_rgba(0,0,0,0.6)] duration-200" :class="[isCollapse ? 'w-[64px]' : 'w-[260px]']">
      <div @click="isCollapse = !isCollapse" class="sticky top-0 flex h-[50px] shrink-0 items-center justify-center bg-sky-700 dark:bg-sky-900">
        <img class="size-[32px] object-cover align-top" src="/lanqiu.png" alt="" />
        <transition enter-active-class="transition-opacity duration-1000" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <h1 v-if="!isCollapse" class="ml-3 font-bold text-white">{{ title }}</h1>
        </transition>
      </div>
      <el-scrollbar class="flex-1 dark:bg-black">
        <el-menu
          :class="{ 'is-collapse': isCollapse }"
          class="border-none dark:bg-black dark:text-white"
          router
          :collapse="isCollapse"
          :default-active="router.currentRoute.value.path"
        >
          <Menu :isCollapse="isCollapse" :list="router.options.routes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <div class="flex flex-1 flex-col overflow-auto bg-sky-700 dark:bg-sky-900">
      <div class="sticky top-0 flex h-[50px] shrink-0 items-center justify-between px-5">
        <div class="flex items-center">
          <el-icon class="mr-2" @click="isCollapse = !isCollapse">
            <expand v-if="isCollapse" />
            <fold v-else />
          </el-icon>
          <el-breadcrumb separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: item.path }" v-for="item in router.currentRoute.value.matched.filter((r) => r.children.length !== 1)">
              <div class="flex items-center">
                <!-- <el-icon><component :is="item.meta.icon"></component></el-icon> -->
                <span>{{ item.meta.title }}</span>
              </div>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="flex items-center gap-x-2">
          <!-- <el-button class="m-0" circle icon="refresh" /> -->
          <el-button class="m-0" @click="toggleFullscreen" circle icon="FullScreen" />
          <!-- <el-button class="m-0" circle icon="setting" /> -->

          <el-switch
            class="w-10"
            @click="userStore.toggleDark()"
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
                <span>wgk123</span>
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
      <div class="flex-1 bg-white p-5 dark:bg-black">
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
</style>
