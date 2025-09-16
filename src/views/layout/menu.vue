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
.el-menu-item.is-active {
  @apply bg-sky-600 text-white;
}
.dark .el-menu-item.is-active {
  @apply bg-sky-800 text-white;
}
.dark .el-menu-item:not(.is-active):hover span {
  @apply text-black;
}
.dark .el-sub-menu__title:hover span{
  @apply text-black;
}

.is-collapse .el-icon.el-sub-menu__icon-arrow {
  display: none;
}
</style>
