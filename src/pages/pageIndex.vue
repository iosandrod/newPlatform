<template>
  <div class="w-full h-full">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { system } from '@/system'
import { onMounted } from 'vue'

onMounted(() => {
  setTimeout(() => {
    // let currentRoute = system.getRouter().currentRoute
    // if ((currentRoute.fullPath = '/')) {
    //   if (system.getIsLogin()) {
    //     system.routeTo('/home') //
    //   } else {
    //     system.routeTo('/login') //
    //   }
    // }
  }, 1000) //
})
</script>
