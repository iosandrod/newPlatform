/** src/components/PageHeader.tsx */
import { defineComponent, inject, ref } from 'vue'
import { useRouter } from 'vue-router'
// 下面示例用 ant-design 的图标，按需替换或用自己的图标
import {
  DownloadOutlined,
  SearchOutlined,
  MessageOutlined,
  NotificationOutlined,
  StarOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import { System } from '@/system'

export default defineComponent({
  name: 'PageHeader',
  setup() {
    const router = useRouter()
    const searchText = ref('')
    let system: System = inject('systemIns')
    const badges = {
      msg: 34,
      feed: 22,
      fav: 0,
    }

    function onSearch() {
      const q = searchText.value.trim()
      if (q) {
        router.push({ path: '/search', query: { q } })
      }
    }

    return () => (
      <header class="page-header h-50 flex items-center">
        <div class="container flex items-center justify-between">
          {/* 左侧：下载客户端 */}
          <div class="flex items-center space-x-1 ml-50">
            <DownloadOutlined class="text-xl" />
            <div to="/download" class="text-sm">
              下载客户端
            </div>
          </div>

          {/* 中间：搜索框 */}
          <div class="flex-1 mx-8 flex items-center justify-center">
            <input
              v-model={searchText.value}
              placeholder="全局查询"
              class="w-400 h-35 px-3 border border-gray-300 rounded-l-md outline-none"
              onKeyup={(e: KeyboardEvent) => e.key === 'Enter' && onSearch()}
            />
            <button
              class="h-35 px-3 border border-l-0 border-blue-500 bg-blue-500 text-white rounded-r-md"
              onClick={onSearch}
            >
              <SearchOutlined />
            </button>
          </div>

          <div class="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/32"
              alt="avatar"
              class="w-8 h-8 rounded-full cursor-pointer"
            />
            <div class="text-sm">个人中心</div>
            <div class="relative cursor-pointer">
              <MessageOutlined class="text-lg" />
              {badges.msg > 0 && (
                <span class="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {badges.msg}
                </span>
              )}
            </div>
            <div class="relative cursor-pointer">
              <NotificationOutlined class="text-lg" />
              {badges.feed > 0 && (
                <span class="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {badges.feed}
                </span>
              )}
            </div>

            <div class="relative cursor-pointer">
              <StarOutlined class="text-lg" />
              {badges.fav > 0 && (
                <span class="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {badges.fav}
                </span>
              )}
            </div>
            <er-dropdown
              dropMode="hover"
              v-slots={{
                default: () => {
                  let com = (
                    <div class="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-pink-600">
                      {/* <PlusOutlined /> */}
                      <span>
                        {system.getUserInfo()?.user?.username || '登录'}
                      </span>
                    </div>
                  )
                  return com
                },
                dropdown: () => {
                  let com = (
                    <div
                      class="  mt-2 w-120 bg-white border border-gray-200 rounded-lg shadow-lg
            transition-opacity
           "
                    >
                      <div class="py-1">
                        <div
                          href="#"
                          class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          回复我的
                        </div>
                        <div
                          href="#"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                        >
                          @我的
                        </div>
                        <div
                          href="#"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          收到的赞
                        </div>
                        <div
                          href="#"
                          class="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          系统消息
                          <span class="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                        <div
                          href="#"
                          class="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          我的消息
                          <span class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                            34
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                  return com
                },
              }}
            ></er-dropdown>
          </div>
        </div>
      </header>
    )
  },
})
