<template>
  <div class="parent">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { hello, hello1 } from "./api/user"

let a = ref("")
onMounted(async () => {
  // a.value = await hello1(null, { m: "msg" })
})
</script>

<style lang="scss" scoped>
.parent {
  &:hover {
    // background-color: $primary-color;
  }
}
</style>
