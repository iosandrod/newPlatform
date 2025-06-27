import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="p-20 bg-gray-100  space-y-6">
          <div class="grid grid-cols-5 gap-10">
            <div class="bg-white p-20 rounded shadow space-y-6">
              <div class="text-gray-500 text-sm">销量</div>
              <div class="text-24 font-bold">1,200</div>
              <div class="text-gray-400 text-xs">昨：2,261</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-10">
            <div class="bg-white p-20 rounded shadow space-y-6">
              <div class="text-gray-500 text-sm">广告花费</div>
              <div class="text-24 font-bold">125.00</div>
              <div class="text-gray-400 text-xs">昨：86.00</div>
            </div>
            <div class="bg-white p-20 rounded shadow space-y-6">
              <div class="text-gray-500 text-sm">广告销售额</div>
              <div class="text-24 font-bold">$13,620.00</div>
              <div class="text-gray-400 text-xs">昨：$13,210.00</div>
            </div>
          </div>

          <div class="bg-white p-20 rounded shadow space-y-10">
            <div class="flex items-center justify-between">
              <div class="text-lg font-semibold">业绩趋势</div>
              <div class="flex items-center space-x-2">
                <button class="px-10 py-4 text-sm bg-gray-100 rounded">
                  今天
                </button>
                <button class="px-10 py-4 text-sm bg-gray-100 rounded">
                  前7天
                </button>
                <button class="px-10 py-4 text-sm bg-blue-100 text-blue-600 rounded">
                  前30天
                </button>
                <button class="px-10 py-4 text-sm bg-gray-100 rounded">
                  上月
                </button>
                <button class="px-10 py-4 text-sm bg-gray-100 rounded">
                  今年
                </button>
                <button class="px-10 py-4 text-sm bg-gray-100 rounded">
                  自定义
                </button>
                <button class="px-10 py-4 text-sm bg-gray-100 rounded">
                  指标对比
                </button>
                <button class="px-10 py-4 text-sm bg-gray-100 rounded">
                  时间对比
                </button>
              </div>
            </div>

            <div class="grid grid-cols-6 gap-10 mt-10">
              <div class="text-center space-y-2">
                <div class="text-gray-500 text-sm">销量</div>
                <div class="text-lg font-bold">0</div>
                <div class="text-gray-400 text-xs">0.00%</div>
              </div>
              <div class="text-center space-y-2">
                <div class="text-gray-500 text-sm">销售额</div>
                <div class="text-lg font-bold text-blue-600">$0.00</div>
                <div class="text-gray-400 text-xs">0.00%</div>
              </div>
              <div class="text-center space-y-2">
                <div class="text-gray-500 text-sm">广告花费</div>
                <div class="text-lg font-bold text-red-600">$14.21</div>
                <div class="text-red-500 text-xs">+100.00%</div>
              </div>
              <div class="text-center space-y-2">
                <div class="text-gray-500 text-sm">广告销售额</div>
                <div class="text-lg font-bold">$0.00</div>
                <div class="text-gray-400 text-xs">0.00%</div>
              </div>
              <div class="text-center space-y-2">
                <div class="text-gray-500 text-sm">ACOS</div>
                <div class="text-lg font-bold">100.00%</div>
                <div class="text-red-500 text-xs">+100.00%</div>
              </div>
              <div class="text-center space-y-2">
                <div class="text-gray-500 text-sm">订单毛利</div>
                <div class="text-lg font-bold text-green-600">-$14.21</div>
                <div class="text-green-600 text-xs">-100.00%</div>
              </div>
            </div>

            <div class="h-300 bg-gray-50 border border-dashed border-gray-300 rounded mt-20 flex items-center justify-center text-gray-400 text-sm">
              图表区域（这里留空，实际可插入 echarts、chart.js、d3.js 等图表）
            </div>
          </div>
        </div>
      )
    }
  },
})
