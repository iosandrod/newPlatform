<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div
      class="flex flex-col items-center p-8 text-center bg-white shadow-lg rounded-2xl w-96"
    >
      <h1 class="mb-4 text-2xl font-bold text-red-500">连接服务器失败</h1>
      <p class="mb-6 text-gray-600">
        无法连接到服务器，请点击“重新连接”按钮尝试。
      </p>

      <div v-if="loading" class="mb-4 text-blue-500">正在尝试重新连接...</div>

      <button
        :disabled="loading"
        @click="reconnect"
        class="px-6 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ loading ? '重试中...' : '重新连接' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { system } from './system'

const loading = ref(false)
async function reconnect() {
  try {
    loading.value = true
    // 模拟一个重新连接请求
    let _sys = system
    let http = _sys.getHttp()
    await http.initClient()
    loading.value = false
    system.setSystemError(false)//
  } catch (error) {
    system.confirmErrorMessage('重新连接失败，请稍后再试。') //
    loading.value = false
  }
}
</script>

<style scoped>
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
