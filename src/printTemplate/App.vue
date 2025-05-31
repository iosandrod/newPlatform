<template>
  <div style="height: 100%;">
    <PtdDesigner
      ref="designerRef"
      :pre-data-set="preDataSet"
      :pre-data-source="preDataSource"
    >
      <template #roy-designer-header-slot>
        <div class="head-slot">
          <i
            v-for="(tool, index) in headIconConfig"
            :key="index"
            :class="tool.icon"
            :title="tool.title"
            class="roy-header-icon"
            @click="tool.event"
          ></i>
        </div>
      </template>
      <template #roy-designer-toolbar-slot>
        <div
          v-for="(tool, index) in toolbarSlotConfig"
          :key="index"
          :title="tool.name"
          class="toolbar-slot-item"
          @click="tool.event"
        >
          <i :class="tool.icon"></i>
        </div>
      </template>
    </PtdDesigner>

    <PtdViewer
      v-if="viewerVisible"
      :component-data="componentData"
      :data-set="dataSet"
      :data-source="dataSource"
      :page-config="pageConfig"
      v-model:visible="viewerVisible"
      :need-toast="false"
    />

    <TemplateViews
      v-if="templateVisible"
      v-model:visible="templateVisible"
      @load="loadTemp"
    />

    <div class="fork-me">
      <a
        href="https://github.com/ROYIANS/print-template-designer"
        target="_blank"
      >
        <i class="ri-github-line"></i>
        Give me a Star!
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import toast from '@/printTemplate/utils/toast'
// import PtdDesigner from '@/printTemplate/components/Designer/PtdDesigner.vue'
import PtdViewer from '@/printTemplate/components/Viewer/PtdViewer.vue'
import TemplateViews from '@/printTemplate/views/templates/TemplateViews.vue'

// Vuex store
const store = useStore()

// Map state from Vuex
const pageConfig = computed(() => store.state.printTemplateModule.pageConfig)
const componentData = computed(
  () => store.state.printTemplateModule.componentData,
)
const dataSource = computed(() => store.state.printTemplateModule.dataSource)
const dataSet = computed(() => store.state.printTemplateModule.dataSet)
// Refs
const designerRef = ref(null)
const viewerVisible = ref(false)
const templateVisible = ref(false) //
// Predefined configurations
const toolbarSlotConfig = [
  {
    name: '从报表配置拉取表格',
    icon: 'ri-table-line',
    event: () => {
      //
      toast('(开发者自定义按钮)')
    },
  },
]
const headIconConfig = [
  {
    name: 'template',
    icon: 'ri-file-word-2-line',
    title: '预设模板',
    event: () => {
      templateVisible.value = true
    },
  },
  {
    name: 'dataset',
    icon: 'ri-database-line',
    title: '数据源模拟',
    event: () => {
      toast('开发中')
    },
  },
  {
    name: 'ShowViewer',
    icon: 'ri-eye-line',
    title: '预览设计模板',
    event: () => {
      showViewer()
    },
  },
]
const preDataSource = [
  {
    id: '0001',
    title: '当前日期（中文）',
    field: 'curDateChn',
    typeName: 'BigCurDate',
  },
  {
    id: '0002',
    title: '当前日期（数字）',
    field: 'curDateNum',
    typeName: 'CurDateTime',
  },
  {
    id: '0003',
    title: '当前日期时间（数字）',
    field: 'curDateTime',
    typeName: 'CurDateTime',
  },
  {
    id: '0004',
    title: '表格数据',
    field: 'tableData',
    typeName: 'Array',
  },
]
const preDataSet = {
  curDateTime: 'YYYY.MM.DD hh:mm',
  curDateChn: '',
  curDateNum: 'YYYY年MM月DD日',
  currentTime: 'YYYY年MM月DD日',
  tableData: [{}, {}, {}, {}],
}

// Methods
function showViewer() {
  viewerVisible.value = true
}

function loadTemp(data) {
  // Call the designer's loadTemplateData method
  if (
    designerRef.value &&
    typeof designerRef.value.loadTemplateData === 'function'
  ) {
    designerRef.value.loadTemplateData(data)
  }
  templateVisible.value = false
}

// onMounted hook: show initial toasts
onMounted(async () => {
  await toast(
    '欢迎使用ROYIANS的打印模板设计器，仅个人学习使用',
    'success',
    3000,
  )
  await toast('当前网页预览的是最新开发分支，请留意', 'warning', 3000)
  console.log('contributed by ROYIANS@Little-Dreamland﹢')
})
</script>

<style lang="scss">
html,
body,
.height-all {
  height: 100%;
}

.head-slot {
  display: flex;
  height: 40px;
  align-items: center;

  .roy-header-icon {
    padding: 0 8px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background: var(--roy-color-primary-light-3);
    }
  }
}

.toolbar-slot-item {
  cursor: pointer;
  background: var(--roy-bg-color);
  display: grid;
  width: 18px;
  height: 18px;
  font-size: 10px;
  line-height: 18px;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
  padding: 4px;
  text-align: center;
  border-radius: 4px;

  & + .roy-designer-main__toolbar__item {
    margin-left: 5px;
  }

  &:hover {
    background: var(--roy-bg-color-page);
  }

  i {
    padding: 0;
    margin: 0;
    font-size: 14px;
  }
}

.fork-me {
  a {
    text-decoration: none;
    color: #fff;
  }

  width: 250px;
  height: 32px;
  line-height: 32px;
  background: black;
  text-align: center;
  font-family: fantasy;
  transform: rotate(-45deg);
  position: fixed;
  right: -69px;
  bottom: 39px;
  cursor: pointer;
}
</style>
