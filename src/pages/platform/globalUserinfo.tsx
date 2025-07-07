import { system } from '@/system'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'globalUserinfo',
  props: {}, //
  setup(props, ctx) {
    //
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
                  <erButtonGroup
                    items={[
                      {
                        label: '修改密码',
                        fn: () => {
                          system.changePassword()
                        },
                      },
                      {
                        label: '保存',
                        fn: () => {
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
