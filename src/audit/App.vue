<template>
  <section class="flow-edit-box" v-loading.fullscreen="launching">
    <div class="fd-main-box" v-dragscroll>
      <Flow ref="flowBox"></Flow>
    </div>
  </section>
</template>

<script setup>
import { WIDGET } from '@/audit/components/flow/common/FlowConstant'
import { initWidgetFormula } from '@/audit/components/flow/common/FlowFormula'
import {
  filterConditionWidgets,
  resetAllNodeFormAuth,
} from '@/audit/components/flow/common/FormAuth'
import {
  cleanUnrequiredWidget,
  initBranchExp,
} from '@/audit/components/flow/common/FormExp'
import Flow from '@/audit/components/flow/index.vue'
import { useFlowStore } from '@/audit/stores/index'
import { Notification } from '@arco-design/web-vue' //
import { onBeforeMount, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import FlowValidate from '@/audit/views/flow-manage/flow-validate'
import { onMounted } from 'vue'
import { system } from '@/system'

let { flowDefinition } = useFlowStore()
const router = useRouter()

let launching = ref(false) // 流程发布中
let baseBox = ref() // 基本信息组件
let formMakeBox = ref() // 表单设计组件
let flowBox = ref() // 流程组件

const validate = (flowDef) => {
  let errs = []
  let { workFlowDef, flowWidgets, nodeConfig, flowPermission } = flowDef

  // 流程定义检查是否合法
  errs.push(...FlowValidate.verifyBaseInfo(workFlowDef))
  errs.push(...FlowValidate.verifyFormInfo(flowWidgets))
  errs.push(...FlowValidate.verifyFlowInfo(nodeConfig, flowPermission))

  // 基本信息组件内部校验
  baseBox.value && baseBox.value.validate()

  if (errs.length > 0) {
    for (let i = 0; i < errs.length; i++) {
      setTimeout(() => Notification.error(errs[i]), i * 50)
    }
    return false
  }

  // 清除focus
  flowWidgets.forEach((widget) => {
    delete widget.focus
    if ([WIDGET.DETAIL].includes(widget.type))
      widget.details.forEach((i) => delete i.focus)
  })
  return true
}

const initNodeConfig = (flowDef) => {
  let { flowWidgets, nodeConfig } = flowDef
  // 初始化分支表达式
  initBranchExp(nodeConfig)

  // 重新设置一下节点表单权限
  let conditionWidgets = []
  filterConditionWidgets(nodeConfig, conditionWidgets)
  resetAllNodeFormAuth(nodeConfig, flowWidgets, conditionWidgets)
  // 组件重新生成一下计算表达式
  initWidgetFormula(flowWidgets)
}

const deploy = () => {
  launching.value = true
  let flowDef = JSON.parse(JSON.stringify(toRaw(flowDefinition)))
  if (validate(flowDef)) {
    initNodeConfig(flowDef)
    console.log('发布审批', flowDef)
  } else {
    launching.value = false
  }
}
onMounted(() => {
})
onBeforeMount(async () => {
  // if (flowDefinition.workFlowDef == undefined) {
  //   router.push("/flowmanindex");
  // }
})
</script>

<style lang="scss" scoped>
@import '@/audit/styles/variables.module.scss';

$header-height: 70px;
$canvas-bg: $MainContentBg;

.fd-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  width: 100%;
  height: $header-height;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  user-select: none;

  .fd-nav-left {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;

    .back {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-text-2);
      background-color: var(--color-secondary);
      font-size: 14px;
      border-radius: var(--border-radius-small);

      &:hover {
        background-color: var(--color-secondary-hover);
      }
    }

    .name-desc {
      display: flex;
      flex-direction: column;
      max-width: 200px;
      margin-left: 15px;

      .name {
        font-size: 16px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .desc {
        line-height: 20px;
        font-size: 12px;
        color: #8f959e;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  .fd-nav-mid {
    flex: 2;
  }

  .fd-nav-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.fd-main {
  position: fixed;
  top: $header-height;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100% - $header-height);
  background-color: $canvas-bg;
  overflow: hidden;

  .fd-main-box {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
