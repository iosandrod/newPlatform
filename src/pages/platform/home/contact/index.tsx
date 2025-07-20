import { defineComponent } from 'vue'
import { qrCode } from './myImg'

export default defineComponent({
  name: 'HomeContact', //
  setup() {
    return () => {
      let com = (
        <main className="flex flex-col items-center justify-center flex-grow px-6 py-16">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">联系我们</h1>
          <p className="max-w-2xl mb-10 text-lg text-center text-gray-600">
            如果您对我们的SAAS开发平台感兴趣或有任何建议，欢迎随时与我们联系。
          </p>
          <form className="w-full max-w-lg p-8 bg-white shadow rounded-2xl">
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">姓名</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="请输入您的姓名"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">邮箱</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="请输入您的邮箱"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">留言</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="4"
                placeholder="请输入您的留言"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              提交
            </button>
          </form>
          <div class="absolute right-10 bottom-50 er-h-200 er-w-200 ">
            <h1 class='font-bold'>扫码添加专业人员</h1>
            <img src={qrCode} alt="" />
          </div>
        </main>
      )
      return com
    }
  },
})
