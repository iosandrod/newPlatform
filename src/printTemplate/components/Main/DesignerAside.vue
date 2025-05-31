<template>
  <section :style="asideStyle" class="roy-designer-aside__main">
    <roy-sidebar-menu
      ref="sideMenu"
      :collapsed="true"
      :menu="menuList"
      :theme="isNightMode ? '' : 'white-theme'"
      width="150px"
      @item-click="onMenuSelect"
    />
    <keep-alive>
      <component
        :is="curActiveComponent"
        v-show="showRight"
        :key="curActiveComponentCode"
        class="roy-designer-aside__right_panel"
      />
    </keep-alive>
  </section>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  watch,
  defineAsyncComponent,
  markRaw
} from 'vue'
import { useStore } from 'vuex'

// props
const props = defineProps({
  showRight: { type: Boolean, default: true }
})

// vuex
const store = useStore()
const paletteCount    = computed(() => store.state.printTemplateModule.paletteCount)
const globalCount     = computed(() => store.state.printTemplateModule.globalCount)
const componentsCount = computed(() => store.state.printTemplateModule.componentsCount)
const isNightMode     = computed(() => store.state.printTemplateModule.nightMode.isNightMode)

// reactive menu list, wrap each async component in markRaw to avoid deep reactivity
const menuList = reactive([
  {
    title: '组件',
    code: 'component',
    icon: 'ri-drag-drop-line',
    activeIcon: 'ri-drag-drop-fill',
    isActive: true,
    relativeComponent: markRaw(
      defineAsyncComponent(() => import('./PageComponent.vue'))
    )
  },
  {
    title: '结构',
    code: 'toc',
    icon: 'ri-building-2-line',
    activeIcon: 'ri-building-2-fill',
    isActive: false,
    relativeComponent: markRaw(
      defineAsyncComponent(() => import('./PageToc.vue'))
    )
  },
  {
    title: '属性',
    code: 'palette',
    icon: 'ri-palette-line',
    activeIcon: 'ri-palette-fill',
    isActive: false,
    relativeComponent: markRaw(
      defineAsyncComponent(() => import('./PagePalette.vue'))
    )
  },
  {
    title: '数据源',
    code: 'datasource',
    icon: 'ri-database-2-line',
    activeIcon: 'ri-database-2-fill',
    isActive: false,
    relativeComponent: markRaw(
      defineAsyncComponent(() => import('./DataSource.vue'))
    )
  },
  {
    title: '全局',
    code: 'setting',
    icon: 'ri-settings-6-line',
    activeIcon: 'ri-settings-6-fill',
    isActive: false,
    relativeComponent: markRaw(
      defineAsyncComponent(() => import('./GlobalSetting.vue'))
    )
  }
])

// component refs/state
const sideMenu               = ref(null)
const curActiveComponent     = ref(menuList[0].relativeComponent)
const curActiveComponentCode = ref(menuList[0].code)

// computed style
const asideStyle = computed(() =>
  props.showRight ? 'width: 305px' : 'width: 65px'
)

// methods
function onMenuSelect(_, item) {
  curActiveComponent.value     = item.relativeComponent
  curActiveComponentCode.value = item.code
  menuList.forEach(m => m.isActive = (m.code === item.code))
}

function clickPaletteMenu() {
  const target = menuList.find(m => m.code === 'palette')
  if (target && curActiveComponentCode.value !== 'palette') {
    onMenuSelect(null, target)
  }
}
function clickComponentMenu() {
  const target = menuList.find(m => m.code === 'component')
  if (target && curActiveComponentCode.value !== 'component') {
    onMenuSelect(null, target)
  }
}
function clickGlobalMenu() {
  const target = menuList.find(m => m.code === 'setting')
  if (target && curActiveComponentCode.value !== 'setting') {
    onMenuSelect(null, target)
  }
}

// lifecycle
onMounted(() => {
  // initial selection already set above
})

// watchers
watch(paletteCount,    clickPaletteMenu)
watch(componentsCount, clickComponentMenu)
watch(globalCount,     clickGlobalMenu)
</script>

<style lang="scss" scoped>
.roy-designer-aside__main {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  background: var(--roy-bg-color-overlay);

  .roy-designer-aside__menu {
    height: 100%;
    z-index: 1;

    .roy-designer-aside__menu__icon {
      display: grid;
      top: -7px;
      position: relative;

      i {
        padding: 0;
        margin: 0;
        font-size: 20px;
      }

      span {
        line-height: 14px;
        visibility: visible;
        height: auto;
        width: auto;
        font-size: 8px;
        top: -14px;
        position: relative;
      }
    }
  }

  .roy-designer-aside__right_panel {
    width: calc(100% - 64px);
    background: var(--roy-bg-color-overlay);
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
