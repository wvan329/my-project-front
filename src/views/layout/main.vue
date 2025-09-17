<template>
  <router-view v-slot="{ Component }">
    <!-- <transition enter-active-class="transition-opacity duration-1000" enter-from-class="opacity-0" enter-to-class="opacity-100"> -->
    <!-- <transition name="page" mode="out-in"> -->
    <transition
      mode="out-in"
      enter-active-class="duration-200"
      enter-from-class="opacity-0 -translate-x-5"
      enter-to-class="opacity-100 translate-0"
      leave-active-class="duration-200"
      leave-from-class="opacity-1 translate-0"
      leave-to-class="opacity-0 translate-x-5"
    >
      <component :is="Component" />
    </transition>
    <!-- </transition> -->
  </router-view>
</template>

<script setup>
import { ref } from "vue"
</script>

<style scoped>
@import "@/styles/index.css";
/* .page-enter-from {
  opacity: 0;
  transform: translateX(-20px); 
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
  transform: translateX(20px);
}
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
} */
</style>
