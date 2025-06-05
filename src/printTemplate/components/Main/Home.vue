
<template>
  <roy-container
    id="roy-print-template-designer"
    class="roy-designer-container"
    theme="day"
  >
    <roy-header class="roy-designer-header" height="40px">
      <div id="tttt" class="roy-designer-header__text">
        <i class="ri-pen-nib-line"></i>
        <span>打印模板设计器 | {{ pageConfig.title }}</span>
      </div>
      <div class="roy-designer__right">
        <div>
          <slot name="roy-designer-header-slot" />
        </div>
        <div class="roy-night-mode">
          <i
            v-for="(tool, index) in headIconConfig"
            :key="index"
            :class="tool.icon"
            :title="tool.name"
            @click="tool.event"
          />
          <i
            v-if="configIn.toolbarConfig.showNightMode && isNightMode"
            class="ri-haze-fill"
            title="切换到日间模式"
            @click="dayNightChange"
          />
          <i
            v-else-if="configIn.toolbarConfig.showNightMode"
            class="ri-moon-foggy-fill"
            title="切换到夜间模式"
            @click="dayNightChange"
          />
        </div>
      </div>
    </roy-header>

    <roy-container style="height: calc(100% - 40px)">
      <roy-aside class="roy-designer-aside" width="auto">
        <DesignerAside v-model:showRight="defaultExpendAside" />
      </roy-aside>
      <roy-main class="roy-designer-main">
        <DesignerMain :show-right="defaultExpendAside">
          <template #roy-designer-toolbar-slot>
            <slot name="roy-designer-toolbar-slot" />
          </template>
        </DesignerMain>
      </roy-main>
    </roy-container>
  </roy-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import DesignerAside from './DesignerAside.vue'
import DesignerMain from './DesignerMain.vue'
import shepherd from '@/printTemplate/components/RoyUserTour/userTour'
import toast from '@/printTemplate/utils/toast'
import commonMixin from '@/printTemplate/mixin/commonMixin'
import { renderers } from '@/printTemplate/components/config/renderers'

const VERSION = '0.1.15'

// props
const props = defineProps({
  preComponentData: { type: [Array, Boolean], default: false },
  prePageConfig:    { type: [Object, Boolean], default: false },
  preDataSource:    { type: [Array, Boolean], default: false },
  preDataSet:       { type: [Object, Boolean], default: false },
  config:           { type: Object, default: () => ({}) }
})

// vuex store
const store = useStore() 
// debugger//
// state
const defaultExpendAside = ref(true)
const configIn = reactive({
  toolbarConfig: {
    buttons: ['guide','exportTemplate','importTemplate'],
    showNightMode: true
  }
})

// computed from store
const isNightMode    = computed(() => store.state.printTemplateModule.nightMode.isNightMode)
const pageConfig     = computed(() => store.state.printTemplateModule.pageConfig)
const componentData  = computed(() => store.state.printTemplateModule.componentData)
const dataSource     = computed(() => store.state.printTemplateModule.dataSource)

// vuex actions
const initNightMode = () =>
  store.dispatch('printTemplateModule/nightMode/initNightMode')
const toggleNightMode = (val) =>
  store.dispatch('printTemplateModule/nightMode/toggleNightMode', val)

// access globalProperties ($VXETable, $XModal)
const { proxy } = getCurrentInstance()

// header icon definitions (must come after functions)
const headIcons = [
  { code:'guide',          name:'界面指引',       icon:'ri-question-line',     event: showUserGuide },
  { code:'exportTemplate', name:'保存模板为文件', icon:'ri-file-download-line', event: exportJSON  },
  { code:'importTemplate', name:'从模板文件导入', icon:'ri-file-upload-line',   event: importFile  }
]
const headIconConfig = computed(() =>
  headIcons.filter(item =>
    configIn.toolbarConfig.buttons.includes(item.code)
  )
)

// methods
async function initMounted() {
  console.log(
    `\n %c PrintTemplateDesigner® v${VERSION} %c`,
    'color:#fff;background:linear-gradient(90deg,#4579e1,#009688);padding:5px 0;',
    'color:#000;background:linear-gradient(90deg,#009688,#ffffff);padding:5px 10px 5px 0px;'
  )
  initConfig()
  registerTableRender(renderers)
}

function registerTableRender(renderers) {
  const VXETable = proxy.$VXETable
  for (const key in renderers) {
    VXETable.renderer.add(key, renderers[key])
  }
}

function initConfig() {
  initNightMode()
  Object.assign(configIn, props.config)
  if (props.preComponentData) store.commit('printTemplateModule/setComponentData', props.preComponentData)
  if (props.prePageConfig)    store.commit('printTemplateModule/setPageConfig',    props.prePageConfig)
  if (props.preDataSource)    store.commit('printTemplateModule/setDataSource',    props.preDataSource)
  if (props.preDataSet)       store.commit('printTemplateModule/setDataSet',       props.preDataSet)
}

function dayNightChange() {
  toggleNightMode(!isNightMode.value)
}

function showUserGuide() {
  const driver = shepherd()
  driver.addSteps([
    {
      attachTo: { element: document.querySelector('#royians-guide'), on: 'auto' },
      title: '打印模板设计器界面指引',
      text: '欢迎使用！接下来介绍整个界面。',
      buttons: [{ action() { return this.next() }, text: '下一步' }]
    },
    {
      attachTo: { element: document.querySelector('.roy-designer-header'), on: 'auto' },
      title: '打印模板设计器界面指引',
      text: '这是标题栏，左侧显示”打印模板设计器”字样和当前模板名称，右侧是开发者自定义插槽和夜间模式切换按钮。',
      buttons: [{ action() { return this.next() }, text: '下一步' }]
    },
    {
      attachTo: { element: document.querySelector('.roy-designer-aside'), on: 'auto' },
      title: '打印模板设计器界面指引',
      text: '这是左侧面板，包含四个模块。',
      buttons: [{ action() { return this.next() }, text: '下一步' }]
    },
    {
      attachTo: { element: document.querySelector('.roy-designer-main'), on: 'bottom-start' },
      title: '打印模板设计器界面指引',
      text: '这是右侧面版，包含一个工具栏和一个主窗口。',
      buttons: [{ action() { return this.next() }, text: '下一步' }]
    },
    {
      attachTo: { element: document.querySelector('#royians-guide'), on: 'auto' },
      title: '打印模板设计器界面指引',
      text: '本系统由ROYIANS设计，欢迎使用。',
      buttons: [{ action() { return this.cancel() }, text: '完成' }]
    }
  ])
  driver.start()
}

function readFile(options = {}) {
  return new Promise((resolve, reject) => {
    const types = options.types || []
    const isAll = !types.length || types.includes('*')
    const form = document.createElement('form')
    const input = document.createElement('input')
    input.type = 'file'; input.name = 'file'
    input.multiple = !!options.multiple
    input.accept = isAll ? '' : `.${types.join(', .')}`
    form.style.display = 'none'
    form.appendChild(input)
    document.body.appendChild(form)
    input.onchange = ev => {
      const files = ev.target.files
      let bad = ''
      if (!isAll) {
        for (const f of files) {
          const ext = f.name.split('.').pop()
          if (!types.includes(ext)) { bad = ext; break }
        }
      }
      if (!bad) resolve({ files, file: files[0] })
      else {
        if (options.message !== false) {
          toast({ message: `不支持此格式：${bad}`, status: 'error' })
        }
        reject({ status: false, files, file: files[0] })
      }
      document.body.removeChild(form)
    }
    input.click()
  })
}
async function importFile() {
  try {
    const { file } = await readFile({ types: ['rptd'] })
    const text = await new Promise(r => {
      const reader = new FileReader()
      reader.onload = e => r(e.target.result)
      reader.readAsText(file, 'UTF-8')
    })
    await proxy.$XModal.confirm('读取该文件？将覆盖当前编辑内容！')
    let data = JSON.parse(text)
    if (!data.pageConfig || !data.componentData) {
      toast('文件格式错误，转换失败', 'warning'); return
    }
    loadTemplateData(data)
  }
  catch (err) {
    toast(`读取文件错误：${err.message}`, 'warning')
  }
}

function exportJSON() {
  const a = document.createElement('a')
  a.download = `${pageConfig.value.title}.json`
  a.style.display = 'none'
  const blob = new Blob([JSON.stringify({
    pageConfig: pageConfig.value,
    componentData: componentData.value,
    dataSource: dataSource.value
  })])
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  toast('导出成功！', 'success')
}

function loadTemplateData(data) {
  store.commit('printTemplateModule/setComponentData', data.componentData)
  store.commit('printTemplateModule/setPageConfig',    data.pageConfig)
  store.commit('printTemplateModule/setDataSource',    data.dataSource)
}

function getTemplateData() {
  return {
    type: 'rptd',
    pageConfig: pageConfig.value,
    componentData: componentData.value,
    dataSource: dataSource.value
  }
}

// mounted
onMounted(initMounted)
</script>

<style lang="scss" scoped>
.roy-designer-container {
  background: var(--prism-background);
  width: 100%;
  height: 100%;

  .roy-designer-header {
    background: var(--roy-menu-bar-background);
    width: 100%;
    display: flex;
    justify-content: space-between;

    .roy-designer-header__text {
      color: #fff;
      display: flex;
      height: 100%;
      align-items: center;

      i { margin-right: 5px; }
    }

    .roy-designer__right {
      float: right;
      color: #fff;
      width: 50%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      height: 100%;
      line-height: 40px;
    }

    .roy-night-mode {
      color: #fff;
      line-height: 40px;
      height: 40px;
      overflow: hidden;
      cursor: pointer;

      i {
        float: left;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        height: 100%;
        line-height: 40px;
        padding: 0 8px;
        cursor: pointer;
      }
      i:hover { background: var(--roy-color-primary-light-3); }
    }
  }

  .roy-designer-aside {
    margin: 10px 5px 10px 10px;
    height: calc(100% - 20px);
  }

  .roy-designer-main {
    margin: 5px;
    border-radius: 2px;
    overflow: auto;
    padding: 0;
  }
}
</style>
