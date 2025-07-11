import { System } from '@/system'
import { ElCard } from 'element-plus'
import { computed, defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'AppList',
  props: {
    lists: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const systemIns: System = inject('systemIns')
    const apps = computed(() => props.lists)
    return () => {
      let _lists = (
        <main class="flex-1 p-5 overflow-auto  min-w-60 bg-gray-50">
          <div class="flex flex-wrap">
            {apps.value.map((app: any) => {
              let btns = null
              if (slots?.buttons) {
                btns= slots.buttons(app)
              }
              let com = (
                <ElCard
                  key={app.id}
                  class="relative p-6 m-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
                >
                  <div class="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-row items-start gap-6">
                    {/* 左侧图片 */}
                    <div class="flex-none w-32 h-32 rounded-xl overflow-hidden">
                      <img
                        src={app.photo}
                        alt={app.cnName}
                        class="w-full h-full object-cover"
                      />
                    </div>

                    {/* 中间文字 */}
                    <div class="flex-1">
                      {/* 标题 */}
                      <div class="flex items-center mb-2">
                        <i class={`${app.icon} text-2xl text-blue-600 mr-2`} />
                        <span class="text-2xl font-semibold text-gray-900">
                          {app.cnName}
                        </span>
                      </div>
                      {/* 描述 */}
                      <p class="text-gray-600 leading-relaxed">
                        {app.description}
                      </p>
                    </div>

                    {/* 右下角按钮组 */}
                    <div class="absolute bottom-4 right-4 flex space-x-3">
                      {/* <button
                        type="button"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={() => systemIns.openApp(app.appName)}
                      >
                        进入
                      </button>
                      <button
                        type="button"
                        class="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={() => systemIns.installApp(app.appName)}
                      >
                        安装
                      </button> */}
                      {btns}
                    </div>
                  </div>
                </ElCard>
              )
              return com
            })}
          </div>
        </main>
      )
      return <div class="h-full w-full">{_lists}</div>
    } //
  },
})
