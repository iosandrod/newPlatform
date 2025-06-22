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
          label: 'logo',
          type: 'image', //
          style: {
            height: '200px',
          },
        },
      ],
    }
    return () => {
      let com = (
        <div class="h-full w-full bg-gray-100">
          <main class="py-8 px-4">
            <div class="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-6 border-b pb-2 w-full flex justify-center">
                个人信息
              </h2>
              <div class="">
                <erForm data={data.value} {...fConfig}></erForm>
                <div class="flex items-center justify-end pt-6 border-t">
                  {/* <button type="button"></button>
                  <div class="h-40">
                    <button
                      type="button"
                      class="px-4 ml-10 h-full py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
                    >
                      修改密码
                    </button>
                    <button
                      onClick={() => {
                        system.updateUserInfo() //
                      }}
                      class="px-6 py-2 ml-10 h-full bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      保存
                    </button>
                  </div> */}
                  <erButtonGroup
                    items={[
                      {
                        label: '修改密码',
                        onClick: () => {
                          system.routeTo('password')
                        },
                      },
                      {
                        label: '保存',
                        onClick: () => {
                          system.updateUserInfo() //
                        },
                      }, //
                    ]}
                  ></erButtonGroup>
                </div>
              </div>
            </div>
          </main>
        </div>
      )

      return com
    }
  }, //
})
