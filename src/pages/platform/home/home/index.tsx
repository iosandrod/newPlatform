import { System } from '@/system'
import { ElMenu, ElMenuItem, ElCard, ElButton } from 'element-plus'
import { defineComponent, inject, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'PlatformHomeHome',
  setup() {
    const apps = ref<any[]>([
      {
        id: 1,
        name: 'erp',
        cnName: '低代码ERP应用配置',
        description: '配置化构建应用', //
        icon: 'el-icon-data-analysis',
      },
    ])
    const systemIns: System = inject('systemIns') //
    onMounted(async () => {
      let _as =await systemIns.getAllApps()
    })
    const activeSidebar = ref('1')
    return () => {
      let mainLayout = (
        <div class="flex flex-1 h-full w-full">
          <aside class="bg-gray-100 w-200">
            <ElMenu class="w-full" default-active={activeSidebar.value}>
              <ElMenuItem index="1" class="flex items-center h-40 px-4">
                <i class="mr-2 el-icon-menu"></i>
                应用列表
              </ElMenuItem>
            </ElMenu>
          </aside>
          <main class="flex-1 p-5 overflow-auto  bg-gray-50">
            <div class="flex flex-wrap">
              {apps.value.map((app) => {
                return (
                  <ElCard class="transition-transform transform  ">
                    <div class="flex items-center mb-2">
                      <i class={app.icon + ' text-24 mr-2'} />
                      <span class="text-lg font-semibold">{app.cnName}</span>
                    </div>
                    <div class="mb-4 text-sm">{app.description}</div>
                    <div class="text-right">
                      <ElButton
                        type="primary"
                        class="bg-blue-500"
                        onClick={() => systemIns.installApp(app.name)}
                        size="small"
                      >
                        <div class="">安装</div>
                      </ElButton>
                      <ElButton
                        class="bg-blue-500"
                        type="primary"
                        onClick={() => systemIns.openApp(app.name)}
                        size="small"
                      >
                        <div class="">进入</div>
                      </ElButton>
                    </div>
                  </ElCard>
                )
              })}
            </div>
          </main>
        </div>
      )
      let com = <div class="h-full w-full">{mainLayout}</div>
      return com //
    }
  },
})
