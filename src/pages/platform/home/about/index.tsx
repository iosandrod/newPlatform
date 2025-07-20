import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PlatformAbout',
  setup() {
    return () => {
      let _com = (
        <main className="flex flex-col items-center justify-center flex-grow px-6 py-16">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            关于开发平台应用中心
          </h1>
          <p className="max-w-3xl mb-10 text-lg text-center text-gray-600">
            我们致力于通过可视化配置和组件复用，显著提升开发效率，帮助企业快速响应业务变化，实现数字化转型。
          </p>

          <div className="grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 transition bg-white shadow rounded-2xl hover:shadow-lg">
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                配置化开发
              </h2>
              <p className="text-sm text-gray-600">
                通过拖拽式界面和属性面板，无需编码即可快速搭建业务应用。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 transition bg-white shadow rounded-2xl hover:shadow-lg">
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                高效协作
              </h2>
              <p className="text-sm text-gray-600">
                支持多人协同开发，实时预览和发布，大幅提升交付效率。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 transition bg-white shadow rounded-2xl hover:shadow-lg">
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                组件复用
              </h2>
              <p className="text-sm text-gray-600">
                提供丰富的业务组件库与模板，快速复用，降低开发成本。
              </p>
            </div>
          </div>
        </main>
      )
      return _com//
    }
  },
})
