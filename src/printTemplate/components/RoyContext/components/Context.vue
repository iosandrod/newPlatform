<template>
  <ul
    v-show="visible"
    ref="contextmenu"
    :class="contextmenuCls"
    :style="style"
  >
    <slot></slot>
  </ul>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  provide,
  defineExpose,
  nextTick,
} from 'vue'
// 1. 定义 Props
const props = defineProps({
  eventType: {
    type: String,
    default: 'contextmenu'
  },
  theme: {
    type: String,
    default: 'default'
  },
  autoPlacement: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// 2. 定义 Emits
const emit = defineEmits(['show', 'hide', 'contextmenu'])

// 3. 本地状态
const visible = ref(false)
const references = ref([]) // 存储所有调用 addRef 注册的引用 { el, vnode }
const style = reactive({ top: 0, left: 0 })

// 4. 计算属性
const isClick = computed(() => props.eventType === 'click')
const contextmenuCls = computed(() => [
  'roy-context',
  `roy-context--${props.theme}`
])

// 5. 唯一 ID，用来在全局 window.$$VContextmenu 中注册/查找
const contextmenuId = `roy-ctx-${Date.now()}-${Math.random().toString(36).substr(2)}`

// 6. 拿到根节点引用
const contextmenu = ref(null)

// 7. “点击页面其他位置” 的处理函数
function handleBodyClick(event) {
  const notOutside =
    contextmenu.value.contains(event.target) ||
    (isClick.value &&
      references.value.some((refObj) => refObj.el.contains(event.target)))

  if (!notOutside) {
    visible.value = false
  }
}

// 8. “右键/点击触发” 的处理函数，绑定在各个引用元素上
function handleReferenceContextmenu(event) {
  event.preventDefault()

  if (props.disabled) {
    return
  }

  // 找到当前触发事件的引用对象
  const reference = references.value.find((refObj) =>
    refObj.el.contains(event.target)
  )
  emit('contextmenu', reference ? reference.vnode : null)

  const eventX = event.pageX
  const eventY = event.pageY

  show() // 显示自身

  nextTick(() => {
    // 先让 DOM 更新，才能正确拿到尺寸
    const ctx = contextmenu.value
    let top = eventY
    let left = eventX

    if (props.autoPlacement) {
      const menuW = ctx.clientWidth
      const menuH = ctx.clientHeight
      if (eventY + menuH >= window.innerHeight) {
        top -= menuH
      }
      if (eventX + menuW >= window.innerWidth) {
        left -= menuW
      }
    }

    style.top = `${top}px`
    style.left = `${left}px`
  })
}

// 9. 显示函数
function show(position) {
  // 隐藏其他注册过的 Context
  if (window.$$VContextmenu) {
    Object.keys(window.$$VContextmenu).forEach((key) => {
      if (key !== contextmenuId) {
        window.$$VContextmenu[key].hide()
      }
    })
  }
  if (position) {
    style.top = `${position.top}px`
    style.left = `${position.left}px`
  }
  visible.value = true
}

// 10. 隐藏函数
function hide() {
  visible.value = false
}

// 11. 隐藏所有已注册的 Context
function hideAll() {
  if (window.$$VContextmenu) {
    Object.keys(window.$$VContextmenu).forEach((key) => {
      window.$$VContextmenu[key].hide()
    })
  }
}

// 12. 允许子组件注册自身引用，并自动添加监听
//    refObj 应该为 { el: HTMLElement, vnode: VNode }
function addRef(refObj) {
  references.value.push(refObj)
  refObj.el.addEventListener(props.eventType, handleReferenceContextmenu)
}

// 13. 监视 visible，当其变为 true / false 时添加或移除全局点击监听
watch(visible, (val) => {
  if (val) {
    emit('show', null)
    document.body.addEventListener('click', handleBodyClick)
  } else {
    emit('hide', null)
    document.body.removeEventListener('click', handleBodyClick)
  }
})

// 14. onMounted: 将自身挂载到 body，并注册到全局 window.$$VContextmenu
onMounted(() => {
  // 把元素挂到 <body> 下，确保浮层不被父容器剪裁
  document.body.appendChild(contextmenu.value)

  if (window.$$VContextmenu) {
    window.$$VContextmenu[contextmenuId] = { hide }
  } else {
    window.$$VContextmenu = { [contextmenuId]: { hide } }
  }
})

// 15. onBeforeUnmount: 清理事件、移除自身
onBeforeUnmount(() => {
  // 从 body 中移除
  if (contextmenu.value.parentNode === document.body) {
    document.body.removeChild(contextmenu.value)
  }
  // 从全局注册表中移除
  if (window.$$VContextmenu) {
    delete window.$$VContextmenu[contextmenuId]
  }
  // 解绑所有注册引用的事件监听
  references.value.forEach((refObj) => {
    refObj.el.removeEventListener(props.eventType, handleReferenceContextmenu)
  })
  // 移除 body 点击监听
  document.body.removeEventListener('click', handleBodyClick)
})

// 16. 向子组件提供 addRef
provide('$$contextmenu', {
  addRef,
  show,
  hide, 
  hideAll
})
defineExpose({
  addRef,
  show,
  hide, 
  hideAll,
  _uid: contextmenuId//
})
</script>

<style>
.roy-context {
  position: absolute;
  padding: 5px 0;
  margin: 0;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 2px 2px 8px 0 rgba(150, 150, 150, 0.2);
  list-style: none;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  z-index: 2800;
  -webkit-tap-highlight-color: transparent;
}

.roy-context .roy-context-item {
  padding: 5px 14px;
  line-height: 1;
  color: #333;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.roy-context .roy-context-item.roy-context-item--hover {
  color: #fff;
}

.roy-context .roy-context-item.roy-context-item--disabled {
  color: #ccc;
  cursor: not-allowed;
}

.roy-context .roy-context-divider {
  height: 0;
  margin: 5px 0;
  border-bottom: 1px solid #e8e8e8;
}

.roy-context .roy-context-group__menus {
  padding: 0 5px;
  margin: 0;
  list-style: none;
}

.roy-context .roy-context-group__menus .roy-context-item {
  display: inline-block;
  padding: 5px 9px;
}

.roy-context .roy-context-submenu {
  position: relative;
}

.roy-context .roy-context-submenu > .roy-context {
  position: absolute;
}

.roy-context .roy-context-submenu > .roy-context.left {
  left: 0;
  transform: translateX(-100%);
}

.roy-context .roy-context-submenu > .roy-context.right {
  right: 0;
  transform: translateX(100%);
}

.roy-context .roy-context-submenu > .roy-context.top {
  top: -6px;
}

.roy-context .roy-context-submenu > .roy-context.bottom {
  bottom: -6px;
}

.roy-context .roy-context-submenu .roy-context-submenu__title {
  margin-right: 10px;
}

.roy-context .roy-context-submenu .roy-context-submenu__icon {
  position: absolute;
  right: 5px;
}

.roy-context .roy-context-submenu .roy-context-submenu__icon::before {
  content: '\e622';
}

.roy-context--default .roy-context-item--hover {
  background-color: #4579e1;
}

.roy-context--bright .roy-context-item--hover {
  background-color: #ef5350;
}

.roy-context--dark .roy-context-item--hover {
  background-color: #2d3035;
}

.roy-context--dark {
  background: #222222;
  box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #111111;
}

.roy-context--dark .roy-context-item {
  color: #ccc;
}

.roy-context-item i {
  padding: 0 10px 0 0;
}

.roy-context--danger {
  color: #f54536 !important;
}

.roy-context--danger:hover {
  background: #f54536;
  color: #fff !important;
}
</style>
 