import { System } from '@/system'
import { defineComponent, inject } from 'vue'

export default defineComponent({
  //
  setup() {
    let system: System = inject('systemIns')
    return () => (
      <div class="min-h-screen bg-gray-100 p-6">
        <header class="mb-8 flex items-center justify-between">
          <h1 class="text-2xl font-bold">Web 打印系统</h1>
          <button
            onClick={() => {
              system.routeTo('/admin') //
            }}
            class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <span class="inline-block w-4 h-4 bg-no-repeat bg-center bg-contain"></span>
            进入打印后台
          </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['打印模板管理', '打印任务列表', '打印配置中心'].map(
            (title, index) => (
              <div
                class="rounded-2xl bg-white p-4 flex flex-col items-center justify-center shadow hover:shadow-lg transition"
                key={index}
              >
                <span class="inline-block w-12 h-12 mb-4 bg-no-repeat bg-center bg-contain"></span>
                <h2 class="text-lg font-semibold mb-2">{title}</h2>
                <p class="text-gray-500 text-sm mb-4 text-center">
                  {index === 0 &&
                    '拖拉拽设计打印模板，支持条码、二维码、表格等多种组件。'}
                  {index === 1 && '查看和管理打印任务历史，实时监控打印状态。'}
                  {index === 2 &&
                    '管理打印机设备、打印参数、打印区域等配置项。'}
                </p>
                <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm">
                  {index === 0 ? '进入' : index === 1 ? '查看' : '配置'}
                </button>
              </div>
            ),
          )}
        </div>

        <footer class="mt-12 text-center text-gray-400 text-sm">
          © 2025 Web 打印系统. All rights reserved.
        </footer>
      </div>
    )
  },
})
