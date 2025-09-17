<template>
  <div v-for="(item, index) in list" :key="item.path">
    <div v-if="!item.meta?.hidden">
      <el-menu-item class="" v-if="!item.children" :index="item.path">
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
      <Menu v-else-if="item.children.length === 1" :is-collapse="isCollapse" :list="item.children"></Menu>
      <el-sub-menu class="" v-else :index="item.path">
        <template #title>
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span v-if="!isCollapse">{{ item.meta.title }}</span>
        </template>
        <template #default>
          <Menu :is-collapse="isCollapse" :list="item.children"></Menu>
        </template>
      </el-sub-menu>
    </div>
  </div>
</template>

<script setup>
import Menu from "./menu.vue"
import router from "@/router"

defineProps(["list", "isCollapse"])
</script>

<style>
@import "@/styles/index.css";
/* 白色模式 */
.el-menu-item.is-active {
  @apply bg-sky-600 text-white;
}
.el-menu-item:not(.is-active):hover {
  @apply bg-gray-700 text-white;
}
.el-sub-menu__title:hover {
  @apply bg-gray-700 text-white;
}


/* 暗色模式 */
.dark .el-menu-item.is-active {
  @apply bg-sky-800 text-white;
}
.dark .el-sub-menu__title:hover {
  @apply text-black;
}
.dark .el-menu-item:not(.is-active):hover {
  @apply text-black;
}
.dark .el-menu-item:not(.is-active):hover {
  @apply bg-gray-200;
}
.dark .el-sub-menu__title:hover {
  @apply bg-gray-200;
}




.is-collapse .el-icon.el-sub-menu__icon-arrow {
  display: none;
}
</style>
