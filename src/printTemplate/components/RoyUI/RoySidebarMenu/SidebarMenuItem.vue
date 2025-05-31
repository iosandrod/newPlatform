<template>
  <!-- 1) 如果传了 item.component，就渲染它 -->
  <component
    :is="item.component"
    v-if="item.component && !isItemHidden"
    v-bind="item.props"
  />

  <!-- 2) 如果没有 component，但 header 为真，则渲染 header 样式 -->
  <div
    v-else-if="item.header && !isItemHidden"
    :class="item.class"
    class="vsm--header"
    v-bind="item.attributes"
  >
    {{ item.title }}
  </div>

  <!-- 3) 普通菜单项 -->
  <div
    v-else-if="!isItemHidden"
    :class="[{ 'vsm--item_open': show }]"
    class="vsm--item"
    @mouseout="mouseOutEvent"
    @mouseover="mouseOverEvent"
  >
    <!-- 3.1) 菜单链接本身 -->
    <sidebar-menu-link
      :class="itemLinkClass"
      :item="item"
      v-bind="itemLinkAttributes"
      @click.native="clickEvent"
    >
      <!-- icon 区 -->
      <sidebar-menu-icon
        v-if="item.icon && !isMobileItem"
        :icon=" state.active ? ( item.activeIcon || item.icon ) : item.icon "
      />
      <!-- 标题文字（根据折叠状态或是否是“移动端悬浮项”来决定是否渲染） -->
      <transition :appear="isMobileItem" name="fade-animation">
        <template
          v-if=" (isCollapsed && !isFirstLevel) || !isCollapsed || isMobileItem "
        >
          <span class="vsm--title">{{ item.title }}</span>
        </template>
      </transition>
      <!-- badge + 下拉箭头 -->
      <template
        v-if=" (isCollapsed && !isFirstLevel) || !isCollapsed || isMobileItem "
      >
        <sidebar-menu-badge v-if="item.badge" :badge="item.badge" />
        <div
          v-if="itemHasChild"
          :class="[
            { 'vsm--arrow_open': show },
            { 'vsm--arrow_slot': $slots['dropdown-icon'] }
          ]"
          class="vsm--arrow"
        >
          <slot name="dropdown-icon" />
        </div>
      </template>
    </sidebar-menu-link>

    <!-- 3.2) 如果有子菜单，则渲染子菜单容器 -->
    <template v-if="itemHasChild">
      <template
        v-if=" (isCollapsed && !isFirstLevel) || !isCollapsed || isMobileItem "
      >
        <transition
          :appear="isMobileItem"
          name="expand"
          @afterEnter="expandAfterEnter"
          @beforeLeave="expandBeforeLeave"
          @enter="expandEnter"
        >
          <div
            v-if="show"
            :class=" isMobileItem ? 'vsm--dropdown_mobile-item' : '' "
            :style=" isMobileItem ? mobileItemStyle.dropdown : null "
            class="vsm--dropdown"
          >
            <div class="vsm--list">
              <sidebar-menu-item
                v-for="(subItem, subIndex) in item.child"
                :key="subIndex"
                :is-collapsed="isCollapsed"
                :item="subItem"
                :level="level + 1"
                :rtl="rtl"
                :show-child="showChild"
              >
                <slot name="dropdown-icon" />
              </sidebar-menu-item>
            </div>
          </div>
        </transition>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount, inject } from 'vue'
import { useRoute } from 'vue-router'
import { pathToRegexp } from 'path-to-regexp'
import SidebarMenuLink from './SidebarMenuLink.vue'
import SidebarMenuIcon from './SidebarMenuIcon.vue'
import SidebarMenuBadge from './SidebarMenuBadge.vue'

// ---------------------- 1. 注入（inject）来自父组件的回调 ----------------------
// 父组件在 provide 时写的是 'emitActiveShow', 'emitItemClick', 'emitItemUpdate'
const emitActiveShow = inject('emitActiveShow')
const emitItemClick = inject('emitItemClick')
const emitItemUpdate = inject('emitItemUpdate')

// ---------------------- 2. 定义 Props ----------------------
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  isCollapsed: { 
    type: Boolean,
    default: false
  },
  isMobileItem: {
    type: Boolean,
    default: false
  },
  mobileItem: {
    type: Object,
    default: null
  },
  activeShow: {
    type: Object,
    default: null
  },
  showChild: {
    type: Boolean,
    default: false
  },
  showOneChild: {
    type: Boolean,
    default: false
  },
  rtl: {
    type: Boolean,
    default: false
  },
  disableHover: {
    type: Boolean,
    default: false
  },
  mobileItemStyle: {
    type: Object,
    default: null
  }
})

// ---------------------- 3. 定义 Emits ----------------------
const emit = defineEmits([
  'set-mobile-item',
  'unset-mobile-item'
])

// ---------------------- 4. 本地状态（data） ----------------------
const state = reactive({
  active: false,          // 当前项是否“高亮激活”
  exactActive: false,     // 是否“精准匹配激活”
  itemShow: false,        // 控制子菜单是否展开
  itemHover: false        // 鼠标悬停状态（仅用于非折叠且非移动端时高亮）
})

// ---------------------- 5. 访问路由以监听变化 ----------------------
const route = useRoute()

// ---------------------- 6. 计算属性 ----------------------
// 6.1 是否是顶层菜单
const isFirstLevel = computed(() => props.level === 1)

// 6.2 “show” 双向绑定，控制子菜单展开
const show = computed({
  get() {
    if (!itemHasChild.value) {
      return false
    }
    // 若明确传了 showChild 或者是移动端悬浮，则始终展开
    if (props.showChild || props.isMobileItem) {
      return true
    }
    return state.itemShow
  },
  set(val) {
    if (props.showOneChild) {
      // 展开时要将该项通知给父组件，让父组件自动收起其他兄弟项
      val ? emitActiveShow(props.item) : emitActiveShow(null)
    }
    state.itemShow = val
  }
})

// 6.3 构造菜单链接节点（<sidebar-menu-link>）的 class 列表
const itemLinkClass = computed(() => {
  return [
    'vsm--link',
    !props.isMobileItem ? `vsm--link_level-${props.level}` : '',
    { 'vsm--link_mobile-item': props.isMobileItem },
    { 'vsm--link_hover': hover.value },
    { 'vsm--link_active': state.active },
    { 'vsm--link_exact-active': state.exactActive },
    { 'vsm--link_disabled': props.item.disabled },
    props.item.class
  ]
})

// 6.4 菜单链接节点的属性（例如 target、tabindex，以及 item.attributes 中的自定义属性）
const itemLinkAttributes = computed(() => {
  const target = props.item.external ? '_blank' : '_self'
  const tabindex = props.item.disabled ? -1 : null
  return {
    target,
    tabindex,
    ...props.item.attributes
  }
})

// 6.5 菜单项是否隐藏（基于折叠状态 & item.hidden/item.hiddenOnCollapse）
const isItemHidden = computed(() => {
  if (props.isCollapsed) {
    if (props.item.hidden && props.item.hiddenOnCollapse === undefined) {
      return true
    }
    return props.item.hiddenOnCollapse === true
  } else {
    return props.item.hidden === true
  }
})

// 6.6 悬停状态，决定高亮（折叠+顶层时以移动端悬浮为准，否则取 itemHover）
const hover = computed(() => {
  if (props.isCollapsed && isFirstLevel.value) {
    return props.item === props.mobileItem
  }
  return state.itemHover
})

// 6.7 有没有子菜单
const itemHasChild = computed(() => {
  return Array.isArray(props.item.child) && props.item.child.length > 0
})

// ---------------------- 7. 辅助函数：判断当前项是否“激活” ----------------------
/**
 * 7.1 是否存在匹配的子路由
 */
function isChildActive(childList) {
  if (!Array.isArray(childList)) return false
  return childList.some((c) => isLinkActive(c))
}

/**
 * 7.2 基于 alias 判断激活
 */
function isAliasActive(item) {
  if (!item.alias) return false
  const currentFullPath = route.fullPath
  if (Array.isArray(item.alias)) {
    return item.alias.some((alias) => pathToRegexp(alias).test(currentFullPath))
  }
  return pathToRegexp(item.alias).test(currentFullPath)
}

/**
 * 7.3 直接匹配 href 路由
 */
function matchExactRoute(href) {
  if (!href) return false
  const resolved = (
    // 有 vue-router 时优先用 router.resolve
    route.matched
      ? /*eslint-disable*/ 
        // @ts-ignore 
        (useRouter().resolve(href).route.fullPath === route.fullPath)
      : encodeURI(href) === window.location.pathname + window.location.search + window.location.hash
  )
  return resolved
}

/**
 * 7.4 是否部分匹配（非精准匹配）
 */
function matchRoute({ href, exactPath }) {
  if (!href) return false
  if (route.matched) {
    // @ts-ignore
    const { route: resolvedRoute } = useRouter().resolve(href)
    if (exactPath) {
      return resolvedRoute.path === route.path
    }
    return matchExactRoute(href)
  } else {
    return exactPath
      ? encodeURI(href) === window.location.pathname + window.location.search + window.location.hash
      : matchExactRoute(href)
  }
}

/**
 * 7.5 最终判断当前项是否“激活”
 */
function isLinkActive(item) {
  return (
    item.isActive ||
    matchRoute(item) ||
    isChildActive(item.child) ||
    isAliasActive(item)
  )
}

/**
 * 7.6 精准匹配
 */
function isLinkExactActive(item) {
  return matchExactRoute(item.href)
}

// ---------------------- 8. 初始化激活 & 展开状态 ----------------------
function initActiveState() {
  state.active = isLinkActive(props.item)
  state.exactActive = isLinkExactActive(props.item)
}

function initShowState() {
  if (!itemHasChild.value || props.showChild) return
  if (
    (props.showOneChild && state.active && !show.value) ||
    (state.active && !show.value)
  ) {
    show.value = true
  } else if (props.showOneChild && !state.active && show.value) {
    show.value = false
  }
}

function initState() {
  initActiveState()
  initShowState()
}

// ---------------------- 9. 监听逻辑（watch + 生命周期） ----------------------
// 9.1 进来时，如果既不是 header 也不需要渲染自定义 component，就先调用 initState()
if (!props.item.header && !props.item.component) {
  initState()
}

// 9.2 监听路由变化：当 route 变动时，延时 1ms 再重新计算
watch(
  () => route.fullPath,
  () => {
    if (props.item.header || props.item.component) return
    setTimeout(() => {
      initState()
    }, 1)
  }
)

// 9.3 监听 数据对象本身变化（比如 item.label 动态变化时要同步 notify 父组件）
watch(
  () => props.item,
  (newVal, oldVal) => {
    emitItemUpdate(newVal, oldVal)
  }
)

// 9.4 监听 item.isActive，如果父层动态改了 item.isActive，则重新 initState
watch(
  () => props.item.isActive,
  () => {
    initState()
  }
)

// 9.5 监听 activeShow（从父组件注入注入进来，用于“同级只展开一个”逻辑）
// 如果 activeShow 改变，则把当前项 itemShow 设为 item === activeShow
watch(
  () => props.activeShow,
  () => {
    state.itemShow = props.item === props.activeShow
  }
)

// 9.6 如果没有 vue-router，等价于 Vue 2 中的 `destroyed` 钩子，清理 hashchange 事件
let removeHashListener = null
onMounted(() => {
  if (!route.matched) {
    // 没有 vue-router，则使用 hashchange 做路由监听
    window.addEventListener('hashchange', initState)
    removeHashListener = () => {
      window.removeEventListener('hashchange', initState)
    }
  }
})
onBeforeUnmount(() => {
  if (removeHashListener) removeHashListener()
})

// ---------------------- 10. 事件处理方法 ----------------------
/**
 * 点击菜单项时触发
 */
function clickEvent(event) {
  if (props.item.disabled) return
  if (!props.item.href) {
    event.preventDefault()
  }
  emitItemClick(event, props.item, /* 传递组件实例位置 */ null)
  emitMobileItem(event, event.currentTarget.offsetParent)
  if (!itemHasChild.value || props.showChild || props.isMobileItem) {
    return
  }
  if (!props.item.href || state.exactActive) {
    show.value = !show.value
  }
}

/**
 * 为了折叠态下的“移动端悬浮展开”，
 * 若悬浮的项和当前项不是同一个，我们要先触发 unset，再 set
 */
function emitMobileItem(event, itemEl) {
  if (hover.value) return
  if (!props.isCollapsed || !isFirstLevel.value || props.isMobileItem) {
    return
  }
  emit('unset-mobile-item', true)
  setTimeout(() => {
    if (props.mobileItem !== props.item) {
      emit('set-mobile-item', { item: props.item, itemEl })
    }
    if (event.type === 'click' && !itemHasChild.value) {
      emit('unset-mobile-item', false)
    }
  }, 0)
}

/**
 * 鼠标移入菜单项
 */
function mouseOverEvent(event) {
  if (props.item.disabled) return
  event.stopPropagation()
  state.itemHover = true
  if (!props.disableHover) {
    emitMobileItem(event, event.currentTarget)
  }
}

/**
 * 鼠标移出菜单项
 */
function mouseOutEvent(event) {
  event.stopPropagation()
  state.itemHover = false
}

/**
 * 3 个钩子函数，用于控制子菜单展开收起时的过渡：
 */
function expandEnter(el) {
  el.style.height = el.scrollHeight + 'px'
}
function expandAfterEnter(el) {
  el.style.height = 'auto'
}
function expandBeforeLeave(el) {
  if (props.isCollapsed && isFirstLevel.value) {
    el.style.display = 'none'
    return
  }
  el.style.height = el.scrollHeight + 'px'
}
</script>

<style lang="scss" scoped>
/* 下面仅保留必要的样式，具体可根据实际项目做微调 */
.vsm--item {
  position: relative;
}
.vsm--link {
  display: flex;
  align-items: center;
  text-decoration: none;
  user-select: none;
}
/* 以下为示例，项目中请依据原有样式文件补全 */
.vsm--link-hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.vsm--link_active {
  font-weight: bold;
}
.vsm--dropdown {
  overflow: hidden;
  transition: height 0.3s ease;
}
.vsm--dropdown_mobile-item {
  background-color: white;
}
/* 更多样式请参见原项目的 SCSS 文件 */
</style>
