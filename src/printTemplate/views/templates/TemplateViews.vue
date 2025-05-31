<template>
  <RoyModal
    v-if="visibleIn"
    :show.sync="visibleIn"
    height="80%"
    title="预设模板"
    width="70%"
  >
    <roy-main class="TemplateViews">
      <div class="cards">
        <div v-for="(item, index) in templateData" :key="index" class="card">
          <div class="card__image-holder">
            <img :src="item.img" alt="wave" class="card__image" />
          </div>
          <div class="card__title">
            <div class="card__btn" @click="load(item.url)">
              <i class="ri-zoom-in-line"></i>
            </div>
            <h3>
              {{ item.title }}
              <small>{{ item.desp }}</small>
            </h3>
          </div>
        </div> 
      </div>
    </roy-main>
  </RoyModal>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import toast from '@/printTemplate/utils/toast'
import commonMixin from '@/printTemplate/mixin/commonMixin'
import RoyModal from '@/printTemplate/components/RoyModal/RoyModal.vue'

// 引入 mixin 中的逻辑（如 deepCopy、getUuid 等），如果需要可以直接在 setup 中导入或复用
// import { useCommonMixin } from '@/printTemplate/mixin/commonMixin'

// 配置 Axios 默认值
axios.defaults.timeout = 180000
axios.defaults.baseURL = '/print-template-designer'
axios.defaults.withCredentials = false
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 1. 定义 Props & Emits
const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:visible', 'load'])

// 2. 本地状态
const visibleIn = ref(props.visible)
const templateData = ref([
  {
    url: '/templates/comp-purchase-template.rptd',
    img: 'https://s2.loli.net/2023/01/13/4iJbdwgy5rpI8em.png',
    title: '公司采购安排单',
    desp: '测试用',
  },
  {
    url: '/templates/complex-text.rptd',
    img: 'https://s2.loli.net/2023/09/27/i4cpTfgHj2bNxSZ.png',
    title: '富文本分页测试',
    desp: '测试用',
  },
])

// 3. 监听 Props 变化，以同步到本地 visibleIn
watch(
  () => props.visible,
  (newVal) => {
    visibleIn.value = newVal
  },
)

// 4. 监听 visibleIn 改变，向外抛出 update:visible
watch(visibleIn, (newVal) => {
  emit('update:visible', newVal)
})

// 5. 组件挂载后初始化（如果需要）, 这里暂时没有额外逻辑
onMounted(() => {
  // 如果 mixin 中有 initMounted，这里可以直接调用
  // useCommonMixin().initMounted()
})

// 6. 加载模板的方法
async function load(url) {
  try {
    const res = await axios.get(url)
    if (res?.data?.componentData) {
      // 抛出 load 事件，并传递后端返回的数据
      emit('load', res.data)
    } else {
      toast('拉取模板失败')
    }
  } catch (err) {
    console.error(err)
    toast('拉取模板失败')
  }
}
</script>

<style lang="scss">
.TemplateViews {
  height: 100%;
  padding: 6px;

  .cards {
    margin: 8px;
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-gap: 5px;

    .card {
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      background: #ffffff;
      display: inline-block;
      margin: 8px;
      max-width: 300px;
      position: relative;
      text-align: left;
      transition: all 0.3s 0s ease-in;
      width: 300px;

      .card__image {
        max-width: 300px;
      }

      .card__image-holder {
        display: flex;
        align-items: center;
        background: rgba(0, 0, 0, 0.1);
      }

      .card__title {
        background: #ffffff;
        padding: 6px 15px 10px;
        position: relative;
        z-index: 0;
      }

      .card__btn {
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        width: 30px;
        font-size: 14px;
        line-height: 30px;
        height: 30px;
        border-radius: 100%;
        background: #4579e1;
        text-align: center;
        color: #fff;
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 20px;

        &:hover {
          box-shadow: none;
          background: rgba(69, 121, 225, 0.84);
        }
      }
    }
  }
}
</style>
