<template>
  <div v-for="(item, index) in list" :key="item.path">
    <div v-if="!item.meta?.hidden">
      <div v-if="contain(item)">
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
            <span v-if="!isCollapse || show">{{ item.meta.title }}</span>
          </template>
          <template #default>
            <Menu :is-collapse="isCollapse" show="true" :list="item.children"></Menu>
          </template>
        </el-sub-menu>
      </div>
    </div>
  </div>
</template>

<script setup>
import Menu from "./menu.vue"
import router from "@/router"
import useUserStore from "@/stores/user"
const userStore = useUserStore()

defineProps(["list", "isCollapse", "show"])
const permissions = userStore.user.permissions
const contain = (item) => {
  if (permissions.includes(item.name)) return true
  if (item.children) {
    return item.children.some((item) => contain(item))
  }
  if (item.buttons) {
    return item.buttons.some((item) => permissions.includes(item.name))
  }
}
</script>

<style>
@import "@/styles/index.css";


</style>
