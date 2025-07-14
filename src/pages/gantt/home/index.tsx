import { system } from '@/system'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const kpiData = [
      { label: '产能利用率', value: '85%' },
      { label: '交期达成率', value: '92%' },
      { label: '设备OEE', value: '78%' },
      { label: '缺料预警', value: '3条' },
    ]
    //
    const todoList = [
      { title: '未排产订单', count: 5 },
      { title: '加急任务', count: 2 },
      { title: '设备异常', count: 1 },
    ]

    return () => (
      <div class="p-6 bg-gray-100 min-h-screen">
        <div class="w-full flex justify-between">
          <div class="mb-6">
            <h1 class="text-3xl font-bold">APS 排程应用</h1>
            <p class="text-gray-500 mt-1">全局总览</p>
          </div>
          <div class="mb-6">
            <button class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition">
              <div
                class="text-center mx-2"
                onClick={() => {
                  system.routeTo('/admin') //
                }}
              >
                进入后台
              </div>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiData.map((item) => (
            <div class="bg-white rounded-2xl shadow p-4">
              <div class="text-gray-500 text-sm">{item.label}</div>
              <div class="text-2xl font-semibold mt-2">{item.value}</div>
            </div>
          ))}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="bg-white rounded-2xl shadow p-4">
            <h2 class="text-lg font-semibold mb-2">待办事项</h2>
            <ul>
              {todoList.map((todo) => (
                <li class="flex justify-between items-center py-2 border-b last:border-none">
                  <span>{todo.title}</span>
                  <span class="text-blue-500 font-bold">{todo.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div class="bg-white rounded-2xl shadow p-4 lg:col-span-2">
            <h2 class="text-lg font-semibold mb-2">资源负荷趋势</h2>
            <div class="h-48 flex items-center justify-center text-gray-400">
              {/* 图表占位 */}
              图表组件
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div class="bg-white rounded-2xl shadow p-4">
            <h2 class="text-lg font-semibold mb-2">订单交期风险</h2>
            <div class="h-40 flex items-center justify-center text-gray-400">
              {/* 图表占位 */}
              雷达图组件
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow p-4">
            <h2 class="text-lg font-semibold mb-2">库存趋势</h2>
            <div class="h-40 flex items-center justify-center text-gray-400">
              {/* 图表占位 */}
              折线图组件
            </div>
          </div>
        </div>
      </div>
    )
  },
})
