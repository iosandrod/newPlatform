import { System } from '@/system'
import { defineComponent, inject } from 'vue'

export default defineComponent({
  setup() {
    let systemIns: System = inject('systemIns')
    let toLogin = () => {
      systemIns.routeTo('/login')
    }
    return () => (
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <div class="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <h1 class="text-3xl font-bold mb-4 text-gray-800">欢迎使用系统</h1>
          <p class="text-gray-500 mb-6">请先登录以访问系统功能和数据</p>
          <button
            onClick={() => {
              toLogin() //
            }}
            class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
          >
            登录账号
          </button>
          <p class="mt-4 text-sm text-gray-400">
            没有账号？{' '}
            <a href="#" class="text-blue-500 hover:underline">
              立即注册
            </a>
          </p>
        </div>
      </div>
    )
  },
})
