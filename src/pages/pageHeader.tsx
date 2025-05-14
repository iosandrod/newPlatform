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

    
  },
})
