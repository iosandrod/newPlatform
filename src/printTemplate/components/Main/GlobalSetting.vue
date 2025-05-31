<template>
  <roy-main class="roy-designer-global">
    <!-- <vxe-form
      ref="formRef"
      :align="formConfig.align"
      :data="globalSettingConfig"
      :items="globalSettingItems" 
      :loading="formConfig.loading"
      :prevent-submit="formConfig.preventSubmit"
      :rules="{}"
      :size="formConfig.size"
      :span="formConfig.span"
      :title-align="formConfig.titleAlign"
      :title-colon="formConfig.titleColon"
      :title-overflow="formConfig.titleOverflow"
      :title-width="formConfig.titleWidth"
      :valid-config="formConfig.validConfig"
      sync-resize
    /> -->
    <roy-row class="roy-designer-global__pages">
      <roy-col :span="24" class="roy-designer-global__title">纸张大小:</roy-col>
      <roy-col :span="24">
        <div class="roy-designer-global__pages__container">
          <div
            v-for="page in Object.values(pages)"
            :key="page.name"
            :class="{
              'roy-designer-global__pages__item': true,
              'roy-designer-global__pages__item--active': currentPage === page.name
            }"
            @click="currentPage = page.name"
          >
            {{ page.name }}
          </div>
        </div>
      </roy-col>
    </roy-row>
  </roy-main>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import commonMixin from '@/printTemplate/mixin/commonMixin'

// === STATE ===
const pages = reactive({
  A3: { name: 'A3', w: 297, h: 420 },
  A4: { name: 'A4', w: 210, h: 297 },
  A5: { name: 'A5', w: 148, h: 210 },
  A6: { name: 'A6', w: 105, h: 148 },
  A7: { name: 'A7', w: 74,  h: 105 },
  B3: { name: 'B3', w: 353, h: 500 },
  B4: { name: 'B4', w: 250, h: 353 },
  B5: { name: 'B5', w: 176, h: 250 },
  B6: { name: 'B6', w: 125, h: 176 },
  B7: { name: 'B7', w: 88,  h: 125 },
  C3: { name: 'C3', w: 324, h: 458 },
  C4: { name: 'C4', w: 229, h: 324 },
  C5: { name: 'C5', w: 162, h: 229 },
  C6: { name: 'C6', w: 114, h: 162 },
  C7: { name: 'C7', w: 81,  h: 114 }
})

const currentPage = ref('A4')
const globalSettingConfig = ref({})
const formConfig = reactive({
  titleOverflow: true,
  span: 8,
  align: 'left',
  size: 'medium',
  titleAlign: 'right',
  titleWidth: '200',
  titleColon: false,
  preventSubmit: false,
  loading: false,
  validConfig: { autoPos: true }
})
const globalSettingItems = ref([
  { title:'模板名称', field:'title', span:24, itemRender:{ name:'$input' } },
  { title:'纸张方向', field:'pageDirection', span:24, itemRender:{
      name:'$select',
      options:[
        { label:'横向', value:'l' },
        { label:'纵向', value:'p' }
      ],
      props:{ disabled:true }
    }
  },
  { title:'页面位置布局', field:'pageLayout', span:24, itemRender:{
      name:'$select',
      options:[
        { label:'固定位置', value:'fixed' },
        { label:'相对位置', value:'relative' }
      ]
    }
  },
  { title:'页面上边距', field:'pageMarginTop', span:24, itemRender:{
      name:'$input', props:{ type:'number', min:0, max:50 }
    }
  },
  { title:'页面下边距', field:'pageMarginBottom', span:24, itemRender:{
      name:'$input', props:{ type:'number', min:0, max:50 }
    }
  },
  { title:'背景颜色', field:'background', span:24, itemRender:{ name:'$colorPicker', props:{} } },
  { title:'默认字体', field:'fontFamily', span:24, itemRender:{
      name:'$select',
      options:[
        { label:'宋体', value:'simsun' },
        { label:'黑体', value:'simhei' },
        { label:'楷体', value:'kaiti' },
        { label:'仿宋', value:'fangsong' },
        { label:'微软雅黑', value:'Microsoft YaHei' }
      ]
    }
  },
  { title:'默认行高', field:'lineHeight', span:24, itemRender:{
      name:'$select',
      options:[
        { value:'1',   label:'1'   },
        { value:'1.5', label:'1.5' },
        { value:'2',   label:'2'   },
        { value:'2.5', label:'2.5' },
        { value:'3',   label:'3'   }
      ]
    }
  }
])

// === VUEX ===
const store = useStore()
const pageConfig = computed(() => store.state.printTemplateModule.pageConfig)

// Actions
const reDrawRuler = () =>
  store.dispatch('printTemplateModule/rulerThings/reDrawRuler')
const setRect = (payload) =>
  store.dispatch('printTemplateModule/rulerThings/setRect', payload)

// Deep copy from mixin
const { deepCopy } = commonMixin.methods

// === LIFECYCLE ===
onMounted(() => {
  // 初始化表单数据
  globalSettingConfig.value = deepCopy(pageConfig.value)
})

// === WATCHERS ===
// 切换纸张
watch(currentPage, (newPage) => {
  const p = pages[newPage]
  setRect(p)
  reDrawRuler()
  store.commit('printTemplateModule/setPageSize', {
    pageSize: newPage,
    w: p.w,
    h: p.h
  })
})

// 表单数据变动
watch(globalSettingConfig, (newVal) => {
  store.commit('printTemplateModule/setPageConfig', newVal)
})
</script>

<style lang="scss">
.roy-designer-global {
  height: 100%;
  padding: 12px 8px;
  font-size: 12px;

  .vxe-form.size--medium .vxe-form--item-inner {
    display: grid;
  }

  .vxe-form--item-title {
    font-size: 10px;
    text-align: left !important;
    margin-bottom: 5px;

    .vxe-form--item-title-label:before {
      content: '';
      width: 1px;
      height: 80%;
      margin-right: 5px;
      border-left: var(--roy-color-primary) 3px solid;
    }
  }

  .vxe-form--item {
    float: inherit !important;
  }

  .vxe-input--inner {
    border-radius: unset;
    background: transparent;
    color: var(--roy-text-color-primary);
    border-color: var(--roy-border-color);
  }

  .roy-designer-global__pages {
    .roy-designer-global__pages__container {
      margin: 8px;
      display: grid;
      grid-template-columns: repeat(4, auto);
      grid-gap: 5px;
      grid-template-rows: 50px;
    }

    .roy-designer-global__pages__item {
      font-size: 16px;
      line-height: 50px;
      text-align: center;
      border: 1px solid #ccc;
      user-select: none;
      cursor: pointer;

      &:hover {
        border: 1px solid #4579e1;
        background: var(--prism-background);
      }

      &.roy-designer-global__pages__item--active {
        border: 1px solid #4579e1;
        color: #4579e1;
      }
    }
  }

  .roy-designer-global__title {
    padding: 6px 5px;
    margin: 4px;

    &:before {
      content: '';
      width: 1px;
      height: 80%;
      margin-right: 5px;
      border-left: var(--roy-color-primary) 3px solid;
    }
  }
}
</style>
