

import layer from '@/printTemplate/stores/modules/layer.js'
import compose from '@/printTemplate/stores/modules/compose.js'
import snapshot from '@/printTemplate/stores/modules/snapshot.js'
import copy from '@/printTemplate/stores/modules/copy.js'
import lock from '@/printTemplate/stores/modules/lock.js'
import store from '@/printTemplate/stores/index.js'

export const state = {
  ...compose.state,
  ...snapshot.state,
  ...copy.state,
  editMode: 'edit',
  pageConfig: {
    pageSize: 'A4',
    pageDirection: 'p',
    pageLayout: 'fixed',
    pageWidth: 210,
    pageHeight: 297,
    pageCurHeight: 297,
    pageMarginBottom: 8,
    pageMarginTop: 8,
    title: '新建模板',
    scale: 1,
    background: '#ffffff',
    color: '#212121',
    fontSize: 12,
    fontFamily: 'simhei',
    lineHeight: 1
  },
  isInEditor: false,
  componentData: [],
  dataSource: [],
  dataSet: {},
  curComponent: null,
  curTableCell: null,
  curComponentIndex: null,
  isClickComponent: false,
  globalCount: 0,
  paletteCount: 0,
  componentsCount: 0,
  curTableSettingId: null
}

export const getters = {}

export const mutations = {
  ...layer.mutations,
  ...compose.mutations,
  ...snapshot.mutations,
  ...copy.mutations,
  ...lock.mutations,

  setClickComponentStatus(state, status) {
    state.isClickComponent = status
  },

  setEditMode(state, mode) {
    state.editMode = mode
  },

  setInEditorStatus(state, status) {
    state.isInEditor = status
  },

  setCanvasStyle(state, style) {
    state.canvasStyleData = style
  },

  setCurComponent(state, { component, index }) {
    state.curComponent = component
    state.curComponentIndex = index
    state.curTableCell = null
  },

  setCurTableCell(state, { component }) {
    state.curTableCell = component
  },

  setPageSize(state, { pageSize, w, h }) {
    state.pageConfig.pageSize = pageSize
    const swap = state.pageConfig.pageDirection !== 'p'
    state.pageConfig.pageWidth  = swap ? h : w
    state.pageConfig.pageHeight = swap ? w : h
  },

  togglePageDirection(state) {
    state.pageConfig.pageDirection =
      state.pageConfig.pageDirection === 'p' ? 'l' : 'p'
  },

  setPageConfig(state, pageConfig) {
    state.pageConfig = pageConfig
    // 跨模块提交，保持与原来逻辑
    store.commit(
      'printTemplateModule/rulerThings/setRect',
      {
        w: pageConfig.pageDirection === 'p'
             ? pageConfig.pageWidth
             : pageConfig.pageHeight,
        h: pageConfig.pageDirection === 'p'
             ? pageConfig.pageHeight
             : pageConfig.pageWidth
      }
    )
    store.commit('printTemplateModule/rulerThings/setReDrawRuler')
  },

  updateDataValue(state, { data, key, value }) {
    data[key] = value
  },

  setPropValue(state, { propValue, id }) {
    const idx = state.componentData.findIndex(c => c.id === id)
    if (idx !== -1) {
      // 用 splice 保证响应式
      const updated = { ...state.componentData[idx], propValue }
      state.componentData.splice(idx, 1, updated)
      store.commit('printTemplateModule/recordSnapshot')
    }
  },

  setComponentValue(state, { key, value, id }) {
    const idx = state.componentData.findIndex(c => c.id === id)
    if (idx !== -1) {
      const updated = { ...state.componentData[idx], [key]: value }
      state.componentData.splice(idx, 1, updated)
      store.commit('printTemplateModule/recordSnapshot')
    }
  },

  setBindValue(state, { bindValue, id }) {
    const idx = state.componentData.findIndex(c => c.id === id)
    if (idx !== -1) {
      const updated = { ...state.componentData[idx], bindValue }
      state.componentData.splice(idx, 1, updated)
      store.commit('printTemplateModule/recordSnapshot')
    }
  },

  setDataSource(state, dataSource) {
    state.dataSource = dataSource
  },

  setDataSet(state, dataSet) {
    state.dataSet = dataSet
  },

  setCurTableSettingId(state, id) {
    state.curTableSettingId = id
  },

  setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
    if (!isNaN(top))    curComponent.style.top    = Math.round(top)
    if (!isNaN(left))   curComponent.style.left   = Math.round(left)
    if (!isNaN(width))  curComponent.style.width  = Math.round(width)
    if (!isNaN(height)) curComponent.style.height = Math.round(height)
    if (!isNaN(rotate)) curComponent.style.rotate = Math.round(rotate)

    if (top != null || left != null) {
      store.commit('printTemplateModule/setShapePosition', {
        top, left, width, height
      })
    }
  },

  setShapePosition({ curComponent }, { top, left, width, height }) {
    if (!curComponent?.position) return
    const { lx, ty } = curComponent.position
    const originW = curComponent.position.rx - lx
    const originH = curComponent.position.by - ty

    curComponent.position = {
      ...curComponent.position,
      lx: Math.round(!isNaN(left) ? left : lx),
      ty: Math.round(!isNaN(top)  ? top  : ty),
      rx: Math.round(lx + (width ?? originW)),
      by: Math.round(ty + (height ?? originH))
    }
  },

  setShapeSingleStyle({ curComponent }, { key, value }) {
    curComponent.style[key] = value
  },

  setComponentData(state, componentData = []) {
    state.componentData = componentData
  },

  addComponent(state, { component, index }) {
    component.position = {
      lx: component.style.left,
      ty: component.style.top,
      rx: isNaN(component.style.width)
            ? -Infinity
            : component.style.left + component.style.width,
      by: isNaN(component.style.height)
            ? -Infinity
            : component.style.top + component.style.height
    }

    if (component.position.rx === -Infinity) {
      setTimeout(() => {
        const el = document.getElementById(`roy-component-${component.id}`)
        const r  = el.getBoundingClientRect()
        component.position = {
          ...component.position,
          rx: component.position.lx + r.width,
          by: component.position.ty + r.height
        }
      }, 100)
    }

    if (index != null) {
      state.componentData.splice(index, 0, component)
    } else {
      state.componentData.push(component)
    }
  },

  deleteComponent(state, index) {
    if (index == null) {
      index = state.curComponentIndex
    }
    if (index === state.curComponentIndex) {
      state.curComponentIndex = null
      state.curComponent = null
    }
    if (index != null && /\d/.test('' + index)) {
      state.componentData.splice(index, 1)
    }
  },

  setGlobalCount(state) {
    state.globalCount++
  },

  setPaletteCount(state) {
    state.paletteCount++
  },

  setComponentsCount(state) {
    state.componentsCount++
  }
}

export const actions = {}
