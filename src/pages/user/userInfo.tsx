import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, ctx) {
    return () => {
      // let sectionCom = <div></div>
 
      let com = (
        <div class="min-h-screen bg-gray-100">
          <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
            <a
              href="#"
              class="flex items-center text-blue-600 hover:text-blue-800"
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
            </a>
            <div class="flex items-center space-x-3">
              <span class="text-gray-700">欢迎</span>
              <span class="font-medium">13798134216</span>
              <img
                src="https://via.placeholder.com/32"
                alt="头像"
                class="h-32 w-32 rounded-full"
              />
            </div>
          </header>

          <main class="py-8 px-4">
            <div class="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-6 border-b pb-2">个人信息</h2>

              <div class="flex justify-center mb-6">
                <img
                  src="https://via.placeholder.com/120"
                  alt="头像"
                  class="h-120 w-120 rounded-full border-2 border-gray-200"
                />
              </div>

              <form class="space-y-4">
                <div class="flex items-center">
                  <label class="w-1/4 text-gray-700">*邮箱地址：</label>
                  <input
                    type="email"
                    placeholder="登录使用的邮箱地址"
                    class="w-3/4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div class="flex items-center">
                  <label class="w-1/4 text-gray-700">*手机号码：</label>
                  <input
                    type="text"
                    value="13798134216"
                    disabled
                    class="w-3/4 bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500"
                  />
                </div>

                <div class="flex items-center">
                  <label class="w-1/4 text-gray-700">*验证码：</label>
                  <div class="w-3/4 flex space-x-2">
                    <input
                      type="text"
                      placeholder="请输入手机或邮箱收到的验证码"
                      class="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      class="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
                    >
                      获取验证码
                    </button>
                  </div>
                </div>

                <div class="flex items-center">
                  <label class="w-1/4 text-gray-700">昵称：</label>
                  <input
                    type="text"
                    placeholder="昵称"
                    class="w-3/4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div class="flex items-center">
                  <label class="w-1/4 text-gray-700">*真实姓名：</label>
                  <input
                    type="text"
                    placeholder="真实姓名"
                    class="w-3/4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div class="flex items-center">
                  <label class="w-1/4 text-gray-700">微信/QQ：</label>
                  <div class="w-3/4 flex items-center space-x-4">
                    <span class="text-gray-600">已绑定</span>
                    <button
                      type="button"
                      class="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
                    >
                      解除绑定
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-6 border-t">
                  <button
                    type="button"
                  >
                  </button>
                  <div class="space-x-4">
                    <button
                      type="button"
                      class="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
                    >
                      修改密码
                    </button>
                    <button
                      type="submit"
                      class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      )

      return com
    }
  },
})
