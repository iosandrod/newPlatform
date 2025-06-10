<template>
  <div class="w-full h-full">
    <lowcode>
      <template #default="path">
        <keep-alive>
          <design :key="path" ></design>
        </keep-alive>
      </template>
    </lowcode>
  </div>
</template>
<script setup lang="ts">
import design from './design'
import lowcode from './lowcode'
</script>
