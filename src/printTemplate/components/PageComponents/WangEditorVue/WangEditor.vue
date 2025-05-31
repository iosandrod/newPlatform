<template>
  <!-- Vue 3 里直接在 template 中写一个带 ref="box" 的 div -->
  <div ref="box"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { createEditor } from '@wangeditor/editor'

// ---------------------- 1. 定义 Props ----------------------
const props = defineProps({
  defaultContent: {
    // 如果传入的是数组，就直接使用；否则默认 []。
    type: [Array, String],
    default: () => []
  },
  defaultConfig: {
    type: Object,
    default: () => ({})
  },
  mode: {
    type: String,
    default: 'default'
  },
  defaultHtml: {
    type: String,
    default: ''
  },
  // 这里接收外部 v-model 传进来的 value
  value: {
    type: String,
    default: ''
  }
})

// ---------------------- 2. 定义可触发的事件 ----------------------
/**
 * 组件可能会触发以下事件：
 *  - input           （用于自定义 v-model）
 *  - onCreated       （editor 创建完成后）
 *  - onChange        （内容变化时）
 *  - onDestroyed     （editor 销毁时）
 *  - onMaxLength     （达到最大长度限制时）
 *  - onFocus         （获得焦点时）
 *  - onBlur          （失去焦点时）
 *  - customAlert     （自定义 alert，用于截获 wangEditor 的警告）
 *  - customPaste     （自定义粘贴逻辑，用于截获 wangEditor 的粘贴事件）
 */
const emit = defineEmits([
  'input',
  'onCreated',
  'onChange',
  'onDestroyed',
  'onMaxLength',
  'onFocus',
  'onBlur',
  'customAlert',
  'customPaste'
])

// ---------------------- 3. 本地状态 ----------------------
const boxRef = ref(null)       // 用来挂载 wangEditor 的容器 <div>
const curValue = ref('')       // 记录当前编辑器中的 HTML 内容
const editorInstance = ref(null) // 保存 wangEditor 返回的 editor 对象

// ---------------------- 4. 工具函数 ----------------------
/**
 * 当用户在 defaultConfig 里也注册了某个回调时，抛出错误提醒，引导改用 @onXxx 事件代替
 */
function genErrorInfo(fnName) {
  let info = `请使用 '@${fnName}' 事件，不要将同名回调放在 defaultConfig 中`
  info += `\nPlease use '@${fnName}' event instead of props`
  return info
}

/**
 * 将外部传入的 newHtml 同步到编辑器中
 */
function setHtml(newHtml) {
  const ed = editorInstance.value
  if (!ed) return
  ed.setHtml(newHtml)
}

// ---------------------- 5. 创建 wangEditor 实例 ----------------------
function create() {
  if (!boxRef.value) return
  // 拆分出 defaultConfig。如果外部没传就用空对象
  const userConfig = props.defaultConfig || {}

  // defaultContent 可能是 Array，也可能是其他类型。wangEditor 要求 content 为 Array
  // 如果外部传入的是字符串，就认为它不是 content 数组，交给 onChange 中的 value 生命周期去更新
  // 下面以数组形式传递给 content
  const contentArray = Array.isArray(props.defaultContent)
    ? props.defaultContent
    : []

  createEditor({
    selector: boxRef.value, // 挂载节点
    html: props.defaultHtml || props.value || '',
    config: {
      ...userConfig,

      // 以下所有 onXxx 都必须从这里触发 emit，且如果 userConfig 中也存在就报错
      onCreated: (editor) => {
        // 将 editor 实例保存到 ref
        editorInstance.value = Object.seal(editor) // seal 保持与原示例一致
        emit('onCreated', editorInstance.value)
        if (userConfig.onCreated) {
          throw new Error(genErrorInfo('onCreated'))
        }
      },
      onChange: (editor) => {
        const html = editor.getHtml()
        curValue.value = html
        // 触发 v-model
        emit('input', html)
        // 触发 onChange 事件
        emit('onChange', editor)
        if (userConfig.onChange) {
          throw new Error(genErrorInfo('onChange'))
        }
      },
      onDestroyed: (editor) => {
        emit('onDestroyed', editor)
        if (userConfig.onDestroyed) {
          throw new Error(genErrorInfo('onDestroyed'))
        }
      },
      onMaxLength: (editor) => {
        emit('onMaxLength', editor)
        if (userConfig.onMaxLength) {
          throw new Error(genErrorInfo('onMaxLength'))
        }
      },
      onFocus: (editor) => {
        emit('onFocus', editor)
        if (userConfig.onFocus) {
          throw new Error(genErrorInfo('onFocus'))
        }
      },
      onBlur: (editor) => {
        emit('onBlur', editor)
        if (userConfig.onBlur) {
          throw new Error(genErrorInfo('onBlur'))
        }
      },
      customAlert: (info, type) => {
        emit('customAlert', info, type)
        if (userConfig.customAlert) {
          throw new Error(genErrorInfo('customAlert'))
        }
      },
      customPaste: (editor, event) => {
        if (userConfig.customPaste) {
          throw new Error(genErrorInfo('customPaste'))
        }
        let resultValue
        // 将回调通过事件抛出去，外部可以在 @customPaste 中手动调用 callback(val)
        emit('customPaste', editor, event, (val) => {
          resultValue = val
        })
        return resultValue
      }
    },
    content: contentArray,        // 初始内容，必须是数组格式
    mode: props.mode || 'default'  // 编辑器模式
  })
}

// ---------------------- 6. 生命周期 & 监听 ----------------------
// 组件首次挂载时，创建 wangEditor
onMounted(() => {
  create()
})

// 监听外部传入的 value（v-model），如果和当前 curValue 不同，就调用 setHtml 同步
watch(
  () => props.value,
  (newVal) => {
    if (newVal === curValue.value) {
      return
    }
    setHtml(newVal)
  }
)
</script>

<style scoped>
/* 你可以根据需要在此处为编辑器容器（<div ref="box">）添加样式，例如高度、边框等 */
</style>
