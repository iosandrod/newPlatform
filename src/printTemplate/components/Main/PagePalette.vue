<template>
  <div v-if="initCompleted" class="roy-page-tools">
    <div v-if="curActiveComponent && curActiveComponent.id">
      <roy-divider v-if="settingFormItemConfig.length" content-position="left">
        属性设置
      </roy-divider>
      <erForm 
        ref="settingForm"
        :align="formGlobalConfigIn.align"
        :data="settingFormData"
        :items="settingFormItemConfig"
        :loading="formGlobalConfigIn.loading"
        :prevent-submit="formGlobalConfigIn.preventSubmit"
        :rules="{}"
        :size="formGlobalConfigIn.size"
        :span="formGlobalConfigIn.span"
        :title-align="formGlobalConfigIn.titleAlign"
        :title-overflow="formGlobalConfigIn.titleOverflow"
        :valid-config="formGlobalConfigIn.validConfig"
        sync-resize
      />
      <roy-divider content-position="left">样式设置</roy-divider>
      <erForm
        ref="paletteForm"
        :data="formData"
        :items="formItemConfig"
        :loading="formGlobalConfigIn.loading"
        :prevent-submit="formGlobalConfigIn.preventSubmit"
        :rules="{}"
        :size="formGlobalConfigIn.size"
        :span="formGlobalConfigIn.span"
        sync-resize
      /> 
    </div>
    <div
      v-else
      class="roy-page-tools__empty animate__animated animate__headShake"
    >
      <i
        class="ri-door-lock-box-line animate__backInUp"
        style="color: var(--roy-color-warning);"
      />
      <div>请先选定一个组件，再进行该组件的属性设置</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import commonMixin from '@/printTemplate/mixin/commonMixin'
import {
  paletteConfigList,
  settingConfigList,
} from '@/printTemplate/components/config/paletteConfig'

// ------------ 状态 ------------
const initCompleted = ref(false)
const store = useStore()

// 来自 Vuex 的状态
const curComponent = computed(
  () => store.state.printTemplateModule.curComponent,
)
const curTableCell = computed(
  () => store.state.printTemplateModule.curTableCell,
)

// 当前选中的“组件” 或 “表格单元格”
const curActiveComponent = computed(() => {
  return curTableCell.value || curComponent.value
})

// 表单配置
const formGlobalConfigIn = reactive({
  titleOverflow: true,
  span: 8,
  align: 'left',
  size: 'medium',
  titleAlign: 'right',
  titleWidth: '200',
  titleColon: false,
  preventSubmit: false,
  loading: false,
  validConfig: {
    autoPos: true,
  },
})

// 表单数据
const formData = ref({})
const settingFormData = ref({})

// 所有组件的“样式”表单配置
const formItemConfigs = paletteConfigList
// 所有组件的“属性”表单配置
const settingFormItemConfigs = settingConfigList

// 根据当前选中组件，动态取对应的“样式”表单项
const formItemConfig = computed(() => {
  const code = curActiveComponent.value?.component || 'no'
  let _items= formItemConfigs[code] || []
  console.log(_items)
  return _items//
  // return []
})

// 根据当前选中组件，动态取对应的“属性”表单项
const settingFormItemConfig = computed(() => {
  const code = curActiveComponent.value?.component || 'no'
  return settingFormItemConfigs[code] || []
})

// ------------ 监视 ------------
watch(
  curActiveComponent,
  (newComp) => {
    if (newComp) {
      // 将选中组件的 style 对象 替换到“样式表单数据”
      formData.value = newComp.style || {}
      // 将选中组件本身 对象 替换到“属性表单数据”
      settingFormData.value = newComp
    }
  },
  { deep: true, immediate: true },
)

// ------------ 生命周期 ------------
onMounted(() => {
  nextTick(() => {
    initCompleted.value = true
  })
})
</script>

<style lang="scss" scoped>
.roy-page-tools {
  overflow: auto;
  height: calc(100% - 16px);
  padding: 8px;

  .roy-page-tools__empty {
    font-size: 10px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: row wrap;

    i {
      font-size: 28px;
      width: 100%;
      align-self: end;
      text-align: center;
    }

    div {
      text-align: center;
    }
  }
}
</style>

<style lang="scss">
.roy-page-tools {
  .vxe-form.size--medium .vxe-form--item-inner {
    display: grid;
  }

  .vxe-form--item-title {
    // font-size: 10px;
    text-align: left !important;
    margin-bottom: 5px;

    // .vxe-form--item-title-label:before {
    //   content: '';
    //   width: 1px;
    //   height: 80%;
    //   margin-right: 5px;
    //   border-left: var(--roy-color-primary) 3px solid;
    // }
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
}
</style>
