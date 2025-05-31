<template>
  <RoyModal
    v-if="visibleIn"
    :show.sync="visibleIn"
    :title="directExport ? '打印导出' : '打印预览'"
    class="rptd-viewer"
    height="90%" 
    width="90%"
  >
    <RoyLoading :loading="!initCompleted" :loading-text="loadingText">
      <div v-if="isBlankPage" class="roy-page-blank">
        <i class="ri-sticky-note-2-line"></i>
        <span>页面内容为空</span>
      </div>
      <div
        v-else
        id="roy-viewer"
        ref="viewer"
        :class="isExportPDF ? '' : 'is-show-border'"
        class="roy-viewer"
      ></div>
      <div ref="tempHolder" class="roy-temp-holder"></div>
      <div class="roy-viewer-right-conor">
        <div class="roy-viewer-btn" @click="exportPdf">
          <i class="ri-file-ppt-line"></i>
          <span>导出PDF</span>
        </div>
      </div>
    </RoyLoading>
  </RoyModal>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import RoyModal from '@/printTemplate/components/RoyModal/RoyModal.vue'
import RoyLoading from '@/printTemplate/components/RoyLoading/index.vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import toast from '@/printTemplate/utils/toast'
import { getPageGenerator } from '@/printTemplate/components/Viewer/page-generator'
import commonMixin from '@/printTemplate/mixin/commonMixin'

// 1. 定义 Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  componentData: {
    type: Array,
    default: () => []
  },
  pageConfig: {
    type: Object,
    default: () => ({})
  },
  dataSource: {
    type: Array,
    default: () => []
  },
  dataSet: {
    type: Object,
    default: () => ({})
  },
  fileName: {
    type: String,
    default: ''
  },
  directExport: {
    type: Boolean,
    default: false
  },
  needToast: {
    type: [Boolean, String],
    default: '建议导出PDF后再打印，更精准'
  }
})

// 2. 定义 Emits
const emit = defineEmits(['update:visible'])

// 3. Vuex（如果需要根据 mixin 访问 store）
const store = useStore()

// 4. 本地状态
const visibleIn = ref(props.visible)
const initCompleted = ref(false)
const isBlankPage = ref(false)
const isExportPDF = ref(false)
const totalPage = ref(0)
const curPage = ref(0)
const printConfig = reactive({ id: 'roy-viewer' })

// Refs for DOM elements
const viewer = ref(null)
const tempHolder = ref(null)

// 5. 计算属性
const loadingText = computed(() => {
  if (isExportPDF.value) {
    return `正在导出PDF，正在处理第${curPage.value}页/共${totalPage.value}页`
  } else {
    return '正在生成页面...请耐心等待'
  }
})

// 6. 监听 Props 变化
watch(
  () => props.visible,
  (val) => {
    visibleIn.value = val
  }
)

// 当 visibleIn 改变时，向外发射更新事件
watch(visibleIn, (val) => {
  emit('update:visible', val)
})

// 7. 方法
async function initMounted() {
  initCompleted.value = false
  isBlankPage.value = false

  // 生成页面 HTML
  const renderer = getPageGenerator({
    renderElements: props.componentData,
    pagerConfig: props.pageConfig,
    dataSet: props.dataSet,
    dataSource: props.dataSource
  })
  const renderPageHTML = await renderer.render()
  if (renderPageHTML.length) {
    const viewerEl = viewer.value
    if (viewerEl) {
      viewerEl.innerHTML = renderPageHTML
    }
    if (props.needToast) {
      toast(props.needToast, 'info', 5000)
    }
  } else {
    isBlankPage.value = true
  }

  // 隐藏暂存容器
  if (tempHolder.value) {
    tempHolder.value.style.display = 'none'
  }

  // 如果直接导出，先导出 PDF，否则标记完成
  if (props.directExport) {
    await exportPdf()
  } else {
    initCompleted.value = true
  }
}

async function exportPdf() {
  const pages = Array.from(document.getElementsByClassName('roy-preview-page'))
  if (!pages.length) {
    return
  }
  isExportPDF.value = true
  initCompleted.value = false

  const { pageDirection, pageSize, pageWidth, pageHeight, title } = props.pageConfig
  const doc = new jsPDF({
    orientation: pageDirection,
    format: pageSize,
    unit: 'mm'
  })

  totalPage.value = pages.length
  for (let i = 0; i < pages.length; i++) {
    curPage.value = i + 1
    if (i !== 0) {
      doc.addPage(pageSize, pageDirection)
    }
    const canvas = await html2canvas(pages[i], { scale: 5 })
    const isPortrait = pageDirection === 'p'
    doc.addImage({
      imageData: canvas.toDataURL('image/jpeg'),
      format: 'JPEG',
      x: 0,
      y: 0,
      width: isPortrait ? pageWidth : pageHeight,
      height: isPortrait ? pageHeight : pageWidth
    })
  }

  const fileBase =
    props.fileName || props.pageConfig.title || '预览'
  doc.save(`${fileBase}.pdf`)

  initCompleted.value = true
  isExportPDF.value = false

  if (props.directExport) {
    visibleIn.value = false
  }
}

// 8. 生命周期
onMounted(() => {
  initMounted()
})
</script>

<style lang="scss">
.rptd-viewer {
  height: 100%;
  padding: 0;
  margin: 0;

  .vxe-modal--body {
    background: #efefef;
  }

  .roy-viewer {
    height: 100%;
    width: 100%;
    background: #efefef;
    display: block;
    overflow: auto;

    .roy-preview-page {
      margin: 20px auto;
    }
  }

  .is-show-border {
    .roy-preview-page {
      border: solid 1px #000;
    }
  }

  .roy-temp-holder {
    z-index: -1;
  }

  .roy-page-blank {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
  }

  .roy-viewer-right-conor {
    right: 25px;
    bottom: 25px;
    position: absolute;

    .roy-viewer-btn {
      width: 100px;
      height: 24px;
      font-size: 14px;
      line-height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #4579e1;
      border-radius: 4px;
      user-select: none;
      cursor: pointer;
      color: #fff;
      box-shadow: rgba(69, 121, 225, 0.1) 0 4px 12px;

      & + .roy-viewer-btn {
        margin-top: 10px;
      }

      &:hover {
        box-shadow: none;
      }
    }
  }
}

@page {
  .roy-viewer {
    width: 0;
    height: 0;

    .roy-preview-page {
      margin: 0;
      padding: 0;
      border: none;
    }
  }
}

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background-color: #f4f4f4;
  border-radius: 8px;
}

::-webkit-scrollbar-track-piece {
  background-color: #f4f4f4;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #e2e2e2;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #d9d9d9;
}

::selection {
  background: #3e6dcb;
  color: #fff;
}
</style>
