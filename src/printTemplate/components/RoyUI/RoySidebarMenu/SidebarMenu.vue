<template>
  <div
    ref="sidebarRef"
    :class="sidebarClass"
    :style="[ { 'max-width': sidebarWidth } ]"
    class="v-sidebar-menu"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- 头部插槽 -->
    <slot name="header" />

    <div
      :style="state.isCollapsed && [ rtl ? { 'margin-left': '-17px' } : { 'margin-right': '-17px' } ]"
      class="vsm--scroll-wrapper"
    >
      <div
        :style="state.isCollapsed && { width: widthCollapsed }"
        class="vsm--list"
      >
        <sidebar-menu-item
          v-for="(item, index) in menu"
          :key="index"
          ref="menuItems"
          :active-show="state.activeShow"
          :disable-hover="disableHover"
          :is-collapsed="state.isCollapsed"
          :item="item"
          :mobile-item="state.mobileItem"
          :rtl="rtl"
          :show-child="showChild"
          :show-one-child="showOneChild"
          @set-mobile-item="setMobileItem"
          @unset-mobile-item="unsetMobileItem"
        >
          <!-- 下拉图标的命名插槽 -->
          <slot name="dropdown-icon" />
        </sidebar-menu-item>
      </div>

      <!-- 折叠时显示当前移动项的展开区域 -->
      <div
        v-if="state.isCollapsed"
        :style="mobileItemStyle.item"
        class="vsm--mobile-item"
      >
        <sidebar-menu-item
          v-if="state.mobileItem"
          :disable-hover="disableHover"
          :is-collapsed="state.isCollapsed"
          :is-mobile-item="true"
          :item="state.mobileItem"
          :mobile-item-style="mobileItemStyle"
          :rtl="rtl"
          :show-child="showChild"
        >
          <slot name="dropdown-icon" />
        </sidebar-menu-item>

        <transition name="slide-animation">
          <div
            v-if="state.mobileItem"
            :style="mobileItemStyle.background"
            class="vsm--mobile-bg"
          />
        </transition>
      </div>
    </div>

    <!-- 底部插槽 -->
    <slot name="footer" />

    <!-- 切换折叠按钮 -->
    <button
      v-if="!hideToggle"
      :class="{ 'vsm--toggle-btn_slot': $slots['toggle-icon'] }"
      class="vsm--toggle-btn"
      @click="onToggleClick"
    >
      <slot name="toggle-icon" />
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, provide } from 'vue'
import SidebarMenuItem from './SidebarMenuItem.vue'

// ---------------------- 1. 定义 Props ----------------------
const props = defineProps({
  menu: {
    type: Array,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '350px'
  },
  widthCollapsed: {
    type: String,
    default: '50px'
  },
  showChild: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: ''
  },
  showOneChild: {
    type: Boolean,
    default: false
  },
  rtl: {
    type: Boolean,
    default: false
  },
  relative: {
    type: Boolean,
    default: false
  },
  hideToggle: {
    type: Boolean,
    default: false
  },
  disableHover: {
    type: Boolean,
    default: false
  }
})

// ---------------------- 2. 定义 Emits ----------------------
const emit = defineEmits([
  'toggle-collapse', 
  'item-click'
])

// ---------------------- 3. 本地状态 ----------------------
const sidebarRef = ref(null)                    // 对应原 this.$el
const menuItems = ref([])                       // ref 列表，对应原 this.$refs.menuItems

const state = reactive({
  isCollapsed: computed(() => props.collapsed) ,                 // 当前折叠状态
  mobileItem: null,                             // 移动端悬浮时展开的项
  mobileItemPos: 0,                             // 移动端悬浮项距离侧边栏顶部的偏移
  mobileItemHeight: 0,                          // 移动端悬浮项本身高度
  mobileItemTimeout: null,                      // 用于延迟隐藏悬浮项的定时器
  activeShow: null,                             // 当前激活状态，用于控制子组件显示
  parentHeight: 0,                              // 侧边栏父容器高度
  parentWidth: 0,                               // 侧边栏父容器宽度
  parentOffsetTop: 0,                           // 侧边栏相对父容器的顶部偏移
  parentOffsetLeft: 0                           // 侧边栏相对父容器的左侧（或右侧）偏移
})

// ---------------------- 4. 计算属性 ----------------------
// 侧边栏整体宽度，根据折叠状态动态切换
const sidebarWidth = computed(() => {
  return state.isCollapsed ? props.widthCollapsed : props.width
})

// 侧边栏根节点的 class 列表
const sidebarClass = computed(() => {
  return [
    state.isCollapsed ? 'vsm_collapsed' : 'vsm_expanded',
    props.theme ? `vsm_${props.theme}` : '',
    props.rtl ? 'vsm_rtl' : '',
    props.relative ? 'vsm_relative' : ''
  ]
})

// 移动端“悬浮项”展开时的三个不同样式：item、dropdown、background
const mobileItemStyle = computed(() => {
  const wSidebar = sidebarWidth.value
  return {
    // “悬浮项容器” 的样式
    item: [
      { position: 'absolute' },
      { top: `${state.mobileItemPos}px` },
      props.rtl ? { right: '0px' } : { left: '0px' },
      props.rtl
        ? { 'padding-right': wSidebar }
        : { 'padding-left': wSidebar },
      props.rtl && { direction: 'rtl' },
      { 'z-index': 0 },
      { width: `${state.parentWidth - state.parentOffsetLeft}px` },
      { 'max-width': props.width }
    ],
    // “下拉内容” 的样式
    dropdown: [
      { position: 'absolute' },
      { top: `${state.mobileItemHeight}px` },
      { width: '100%' },
      {
        'max-height': `${
          state.parentHeight -
          (state.mobileItemPos + state.mobileItemHeight) -
          state.parentOffsetTop
        }px`
      },
      { 'overflow-y': 'auto' }
    ],
    // “悬浮项背景” 的样式
    background: [
      { position: 'absolute' },
      { top: '0px' },
      { left: '0px' },
      { right: '0px' },
      { width: '100%' },
      { height: `${state.mobileItemHeight}px` },
      { 'z-index': -1 }
    ]
  }
})

// ---------------------- 5. 监听 Props 变化 ----------------------
watch(
  () => props.collapsed,
  (newVal) => {
    if (state.isCollapsed === newVal) return
    state.isCollapsed = newVal
    state.mobileItem = null
  }
)

// ---------------------- 6. 方法 ----------------------
/**
 * 鼠标移入时，如果处于折叠态，需要清除隐藏悬浮项的定时器
 */
function onMouseEnter() {
  if (state.isCollapsed && state.mobileItemTimeout) {
    clearTimeout(state.mobileItemTimeout)
    state.mobileItemTimeout = null
  }
}

/**
 * 鼠标移出时，延迟隐藏当前的 “移动端悬浮项”
 */
function onMouseLeave() {
  unsetMobileItem(false, 300)
}

/**
 * 点击切换折叠按钮
 */
function onToggleClick() {
  state.isCollapsed = !state.isCollapsed
  state.mobileItem = null
  emit('toggle-collapse', state.isCollapsed)
}

/**
 * 当某个子菜单触发 “激活显示” 时（由 SidebarMenuItem 通过 inject() 回调传上来），把它存到 activeShow
 */
function onActiveShow(item) {
  state.activeShow = item
}

/**
 * 当子菜单项被点击时，向外发出 item-click 事件
 */
function onItemClick(event, item, node) {
  emit('item-click', event, item, node)
}

/**
 * 在折叠状态下，鼠标悬浮到某个菜单项时调用此函数
 * 由 SidebarMenuItem 触发 set-mobile-item 事件传上来一个 { item, itemEl }
 */
function setMobileItem({ item, itemEl }) {
  if (state.mobileItem === item) {
    return
  }
  const sidebarRect = sidebarRef.value.getBoundingClientRect()
  const linkEl = itemEl.children[0]  // 菜单项的真实 link 元素
  const { top, height } = linkEl.getBoundingClientRect()

  const offsetTop = top - sidebarRect.top
  initParentOffsets()
  state.mobileItem = item
  state.mobileItemPos = offsetTop
  state.mobileItemHeight = height
}

/**
 * 隐藏当前“移动端悬浮项”。如果 immediate 为 true，则立即隐藏；否则延迟 delay 毫秒后隐藏。
 */
function unsetMobileItem(immediate = false, delay = 800) {
  if (!state.mobileItem) {
    return
  }
  if (state.mobileItemTimeout) {
    clearTimeout(state.mobileItemTimeout)
  }
  if (immediate) {
    state.mobileItem = null
    return
  }
  state.mobileItemTimeout = setTimeout(() => {
    state.mobileItem = null
  }, delay)
}

/**
 * 初始化父容器的各项偏移与宽高，用于计算移动端展开项的定位
 */
function initParentOffsets() {
  const sidebarRect = sidebarRef.value.getBoundingClientRect()
  let parent = props.relative
    ? sidebarRef.value.parentElement
    : document.documentElement

  const { top: parentTop, left: parentLeft } = (props.relative
    ? parent.getBoundingClientRect()
    : { top: 0, left: 0 })

  state.parentHeight = parent.clientHeight
  state.parentWidth = parent.clientWidth

  if (props.relative) {
    // 如果相对定位，则计算相对父元素的偏移
    state.parentOffsetTop =
      sidebarRect.top - (parentTop + parent.clientTop)
    state.parentOffsetLeft = props.rtl
      ? state.parentWidth -
        (sidebarRect.right - (parentLeft + parent.clientLeft))
      : sidebarRect.left - (parentLeft + parent.clientLeft)
  } else {
    // 否则相对于文档根节点
    state.parentOffsetTop = sidebarRect.top
    state.parentOffsetLeft = props.rtl
      ? state.parentWidth - sidebarRect.right
      : sidebarRect.left
  }
}

/**
 * 当某个子菜单自身发生更新时（比如 label 动态变化），
 * 如果它正好是当前悬浮的 mobileItem 或 activeShow，那么同步替换成新的对象引用
 */
function onItemUpdate(newItem, item) {
  if (item === state.mobileItem) {
    state.mobileItem = newItem
  }
  if (item === state.activeShow) {
    state.activeShow = newItem
  }
}

// ---------------------- 7. Provide 给子组件调用 ----------------------
// 供 SidebarMenuItem 注入 (inject) 使用
provide('emitActiveShow', onActiveShow)
provide('emitItemClick', onItemClick)
provide('emitItemUpdate', onItemUpdate)
</script>

<style lang="scss">
@use './scss/vue-sidebar-menu' as *;
</style>
 