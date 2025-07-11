import { System } from '@/system'
import { installApp } from '@/systemFn'
import {
  ElMenu,
  ElMenuItem,
  ElCard,
  ElButton,
  ElCollapse,
  ElCollapseItem,
  ElPagination,
} from 'element-plus'
import { defineComponent, inject, onMounted, ref } from 'vue'
import AppList from './appList'

export default defineComponent({
  name: 'PlatformHomeHome',
  components: {
    ElMenu,
    ElMenuItem,
    ElCard,
    ElButton,
    ElCollapse,
    ElCollapseItem,
    ElPagination,
  },
  setup() {
    const apps = ref<any[]>([])
    const systemIns: System = inject('systemIns') //
    const installedPage = ref(1)
    const installedTotal = ref(0)
    const installedApps = ref<any[]>([])

    // 未安装应用数据
    const uninstalledPage = ref(1)
    const uninstalledTotal = ref(0)
    const uninstalledApps = ref<any[]>([])
    const getInsList =async  () => {
     await  systemIns.getEnterApp().then((res: any) => {
        installedApps.value = res
        installedTotal.value = res.length
        if(res.length==0){
          activeNames.value=['2']//
        }
      })
    }
    const getUninsList = async () => {//
      await systemIns.getInstallApp().then((res: any) => {
        uninstalledApps.value = res
        uninstalledTotal.value = res.length
      })
    }
    const loadList=async ()=>{
      await getInsList()
      await getUninsList()
    }
    const installApp=async (app)=>{
      try {
  await systemIns.installApp(app)
  await loadList()//
        activeNames.value=['1']//
} catch (error) {
  
}
    }
    onMounted(async () => {
      await loadList()
    })
    const activeSidebar = ref('1')
    const activeNames = ref<string[]>(['1'])

    // 分页参数
    const pageSize = 8

    // 已安装应用数据
    return () => {
      let left = (
        <div class="flex flex-1 h-full w-full text-black">
          <aside class="bg-gray-100 lg:w-56">
            <ElMenu class="w-full" default-active={activeSidebar.value}>
              <ElMenuItem index="1" class="flex items-center  px-4">
                <i class="mr-2 el-icon-menu"></i>
                应用列表
              </ElMenuItem>
            </ElMenu>
          </aside>
        </div>
      )
      let com = (
        <div class="h-full w-full flex">
          <div class='w-52'>{left}</div>
          <div class='flex-1 h-full'>
             <ElCollapse
          accordion
          modelValue={activeNames.value}
          onUpdate:modelValue={(val: string[]) => (activeNames.value = val)}
        >
          <ElCollapseItem
            name="1"
          v-slots={{
            title: () => {
              let com=<span class="text-lg font-semibold">
                已安装应用 ({installedTotal.value})
              </span>
              return com
            },
            default:()=>{
              let com=<div class="mt-4">
                <AppList lists={installedApps.value} v-slots={{
                  buttons:(app)=>{
                    let btn=<button
                        type="button"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={() => systemIns.openApp(app.appName)}
                      >
                        进入
                      </button>
                      return btn//
                  }
                }}></AppList>
            </div>
            return com
            }
          }}>
          </ElCollapseItem>
  <ElCollapseItem
            name="2"
            v-slots={{
              title: () => {
                let com=<span class="text-lg font-semibold">
                可安装应用 ({uninstalledTotal.value})
              </span>
              return com
            },
            default:()=>{
              let com=<div class="mt-4">
                <AppList lists={uninstalledApps.value} v-slots={{
                  buttons:(app)=>{
                    let btn= <button
                        type="button"
                        class="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={async() => {
                          installApp(app)
                        }}
                      >
                        安装
                      </button> //
                      return btn
                  }
                }}></AppList>
            </div>
            return com
            }
          }}//
          >
          </ElCollapseItem>
        </ElCollapse>
          </div>
        </div>
      )
      return com //
    }
  },
})
