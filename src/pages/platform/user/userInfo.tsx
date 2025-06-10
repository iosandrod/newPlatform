import { system } from '@/system'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  setup(props, ctx) {
    let data = computed(() => {
      let data = system?.loginInfo?.user || {}
      return data
    })
    let fConfig = {
      itemSpan: 24,
      items: [
        {
          field: 'avatar',
          label: '头像',
          type: 'image', //
          style: {
            height: '200px', //
          },
        },
        {
          field: 'username',
          label: '用户名',
          type: 'string',
        }, //
        {
          field: 'companyCnName',
          label: '公司',
          type: 'string', //
        },
        {
          field: 'companyLogo',
          label: '公司logo',
          type: 'image', //
          style: {
            height: '200px',
          },
        },
      ],
    }
    return () => {
      // let sectionCom = <div></div>

      let com = (
        <div class="min-h-screen bg-gray-100">
          <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
            <div
              onClick={() => {
                system.getRouter().back() ////
              }}
              class="cursor-pointer flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-20 w-20 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>返回</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-gray-700">欢迎</span>
              <span class="font-medium">13798134216</span>
              <img
                alt="头像"
                class="h-32 w-32 rounded-full"
              />
            </div>
          </header>

          <main class="py-8 px-4">
            <div class="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-6 border-b pb-2">个人信息</h2>
              <div class="space-y-4">
                <erForm data={data.value} {...fConfig}></erForm>
                <div class="flex items-center justify-between pt-6 border-t">
                  <button type="button"></button>
                  <div class="space-x-4">
                    <button
                      type="button"
                      class="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
                    >
                      修改密码
                    </button>
                    <button
                      onClick={() => {
                        system.updateUserInfo() //
                      }}
                      class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )

      return com
    }
  },
})
