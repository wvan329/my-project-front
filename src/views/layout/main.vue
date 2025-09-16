<template>
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { ref } from "vue"
</script>

<style scoped>
@import "@/styles/index.css";
.page-enter-from {
  opacity: 0;
  transform: translateX(-20px); /* 从右轻微进入 */
}
.page-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.page-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(20px); /* 向左轻微离开 */
}
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}
</style>
