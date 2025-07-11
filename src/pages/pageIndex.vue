<template>
  <div class="w-full h-full" v-loading="system.pageLoading">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { system } from '@/system'
import { onMounted } from 'vue'


</script>
