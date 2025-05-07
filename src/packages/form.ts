import {
  computed,
  defineComponent,
  isProxy,
  isReadonly,
  nextTick,
  reactive,
  shallowRef,
  isRef,
} from 'vue'
import formEditor, { getDefaultFormEditProps } from '@ER/formEditor/formEditor'
import { FormLayout } from './type'
import { staticData, formConfig, testData1 } from './formEditor/testData'
import { nanoid } from 'nanoid'
import { FormItem } from './formitem'
import { Field, Layout, Table, TableRow } from './layoutType'
import { Base } from '@/base/base'
import { FormInstance, FormRules } from 'element-plus'
import hooks from '@ER/hooks'
import {
  createFieldConfig,
  createGlobalConfig,
  fieldsConfig,
} from './formEditor/componentsConfig'
import _ from 'lodash'
import utils from '@ER/utils'
import generatorData from './formEditor/generatorData'
import { Node } from './formEditor/node'
import ControlInsertionPlugin from './formEditor/components/Layout/ControlInsertionPlugin'
import Sortable from '@/sortablejs/Sortable'
import { uniqueId } from 'xe-utils'
import {} from 'vxe-table'
import { PageDesignItem } from './pageItem'
import formCom from './formCom'
import { formitemTypeMap, selectTypeMap } from './designNodeForm'
import { VxeFormInstance } from 'vxe-pc-ui'
//转换数据
//
let prevEl: any = ''
let prevSortable: any = ''
let inserRowIndex: any = ''
// let prevRows = ''
let inserColIndex = ''
const layoutType = [
  'grid',
  'col',
  'table',
  'tr',
  'td',
  'tabs',
  'tabsCol',
  'collapse',
  'collapseCol',
  'divider',
  'inline',
]
const excludes = [
  'grid',
  'col',
  'table',
  'tr',
  'td',
  'tabs',
  'tabsCol',
  'collapse',
  'collapseCol',
  'divider',
  'inline',
]
const pName = [] //
export class Form extends Base {
  dTableName: string //
  dFormMap: any = shallowRef({})
  sFormMap: any = shallowRef({})
  curDForm: any = null
  curSForm: any = null
  originalData = {}
  tableDataMap: {
    //
    curRow: any
    data: any
  } = {
    data: [],
    curRow: {}, //
  }
  tableConfigMap = {}
  static component = formCom
  pageType = 'form' //
  cachePlugin: any
  formIns?: any
  lang: any = {}
  t: any
  form?: any
  state: {
    validate: any
    store: any[]
    selected: any
    mode: any
    platform: any
    children: any[]
    config: any
    previewVisible: any
    widthScaleLock: any
    data: any
    validateStates: any[]
    fields: any[]
    Namespace: any
    logic: any
    [key: string]: any
  }
  isShow: boolean = true
  isDesign = false ////
  data: any = {} //
  config: any = {}
  curFormItem?: FormItem
  parent?: Form //
  isShowConfig: boolean = true
  formData: any
  nextForm?: Form
  nextFormMap: any = {}
  items: PageDesignItem[] = []
  pcLayout: Layout = {
    type: 'inline',
    columns: [],
    style: {},
    id: null,
    key: null,
  }
  submitConfig = {
    isSync: true,
    pc: {
      size: 'default',
      labelPosition: 'left',
      completeButton: {
        text: '提交',
        color: '',
        backgroundColor: '',
      },
    },
    mobile: {
      labelPosition: 'left',
      completeButton: {
        text: '提交',
        color: '',
        backgroundColor: '',
      },
    },
  }
  layout = {
    pc: [],
    mobile: [],
  }
  _pcLayout: any = null
  _mobileLayout: any = null
  mobileLayout: any[] = []
  props?: any
  constructor(config) {
    super()
    // let _defaultProps
    this.config = config
    //@ts-ignore
    this.props = config
    //@ts-ignore
    this.init() //
    this.formIns = this
  } //
  getButtons() {
    let config = this.config
    let buttons = config.buttons || []
    return buttons
  }
  setItems(items, setLayout = true) {
    this.items.splice(0) //
    for (const item of items) {
      this.addFormItem(item)
    }
    if (setLayout == true) {
      let pcLayout = this.getPcLayout()
      let mobileLayout = this.getMobileLayout()
      let layout = {
        pc: pcLayout,
        mobile: mobileLayout,
      }
      let fields = this.getFields()
      let obj = {
        fields,
        layout,
        list: [], //
      } //
      this.setLayoutData(obj)
    }
  }
  getDragElement(node) {
    return node.__draggable_context?.element
  }

  resetStates() {
    if (prevEl) {
      this.clearBorder(prevEl)
    }
    prevEl = prevSortable = inserColIndex = inserRowIndex = ''
  }
  // setBorder  (el, className) {
  //   this.clearBorder(el)
  //   el.classList.add(className)
  // }
  _onDrop(e) {
    let ER = this
    if (!prevEl || !e.activeSortable) {
      return false
    }
    // 判断当前拖拽的元素是否是 'block' 类型
    const isBlock =
      _.get(e, 'activeSortable.options.dataSource', false) === 'block'
    // 从事件对象中获取拖拽的元素 (dragEl) 和目标元素 (target)
    const { dragEl, target } = e //
    // 获取拖拽元素的真实DOM结构
    const oldEl = this.getDragElement(dragEl)
    // 克隆并包装拖拽的元素，以便插入到新位置
    // console.log(oldEl, 'testOld')//
    const newElement = ER.wrapElement(
      _.cloneDeep(oldEl),
      inserRowIndex !== '',
      true,
      isBlock,
    )
    // 如果不是 'block' 类型的元素，并且原始元素有 context，则删除该 context
    if (!isBlock) {
      if (oldEl.context) {
        let _context = oldEl.context
        let flatNode = _context.getFlattenNodes()
        let ids = flatNode.map((node) => node.id)
        let next = Array.isArray(prevSortable.options.parent)
          ? prevSortable.options.parent
          : [prevSortable.options.parent] //is Array
        let _ids = next.map((node) => node.id)
        if (_ids.some((id) => ids.includes(id))) {
          this.resetStates()
          return
        }
        oldEl.context.delete()
      }
    }

    if (inserRowIndex !== '') {
      let store = []
      // 判断是否是 'subform' 类型的父级元素，并获取正确的存储数组
      if (prevSortable.options.parent.type === 'subform') {
        store = prevSortable.options.parent.list[0]
      } else {
        store = Array.isArray(prevSortable.options.parent)
          ? prevSortable.options.parent
          : prevSortable.options.parent.list
      }
      // 在指定的索引位置插入新元素
      store.splice(inserRowIndex, 0, newElement)
      // 关联新元素的上下文信息
      utils.addContext({
        node: store[inserRowIndex],
        parent: prevSortable.options.parent,
        form: ER.formIns, //
      })
    }

    // 处理列插入逻辑
    if (inserColIndex !== '') {
      const {
        el: {
          __draggable_component__: { list },
        },
        el,
        constructor: { utils: sortableUtils },
      } = prevSortable

      // 在指定的索引位置插入新元素
      list.splice(inserColIndex, 0, newElement)

      // 关联新元素的上下文信息
      utils.addContext({
        node: newElement,
        parent:
          prevSortable.options.parent[
            sortableUtils.index(prevSortable.el.parentNode)
          ],
        form: ER.formIns,
      })
    }
    // 如果有行插入或列插入操作，则遍历新元素，并检查是否需要额外的字段处理
    if (inserColIndex !== '' || inserRowIndex !== '') {
      // console.log(ER, 'testERRR')//
      utils.deepTraversal(newElement, (node) => {
        if (utils.checkIsField(node)) {
          ER.addField(node) // 添加字段到表单
        }
      })
      // 在下一次DOM更新后，选中新的元素
      nextTick(() => {
        ER.setSelection(newElement)
      })
    }
    // 重置拖拽状态
    this.resetStates()
  }
  _dragOver(e) {
    let ER = this
    e.cancel()
    this.resetStates()
    const {
      activeSortable: {
        constructor: { utils: SortableUtils },
        options: { dataSource },
        el: {
          __draggable_component__: { list },
        },
      },
      activeSortable,
      target,
      originalEvent,
      dragEl,
      sortable: {
        el,
        el: {
          __draggable_component__: { list: targetList },
        },
      },
      sortable,
    } = e
    // console.log(dataSource, 'testDataSource')//
    if (sortable.options.dataSource === 'block') {
      return false
    }
    if (target.dataset.layoutType === 'grid') {
      return false
    }
    const dragNode = this.getDragElement(dragEl)
    const targetNode = this.getDragElement(target)
    if (
      (!utils.checkIsField(dragNode) || dragNode.type === 'subform') &&
      utils.checkIsInSubform(targetNode)
    ) {
      return false
    }
    if (target.dataset.layoutType === 'subform') {
      if (!utils.checkIsField(dragNode) || dragNode.type === 'subform') {
        return false
      }
    } //
    originalEvent.stopPropagation && originalEvent.stopPropagation()
    const direction = ''
    const targetContainer = el.parentNode
    const targetOnlyOne = targetList.length === 1
    const options = sortable.options
    //@ts-ignore
    let newTarget = SortableUtils.closest(
      target,
      options.draggable, //@ts-ignore
      sortable.el,
    )
    if (dragEl.contains(newTarget)) {
      return false
    }
    if (
      /^(grid-col|tabs-col|td|collapse-col|root|inline|subform)$/.test(
        target.dataset.layoutType,
      )
    ) {
      newTarget = target
      const state =
        newTarget.__draggable_component__ ||
        newTarget.children[0].__draggable_component__
      if (!state.list.length) {
        prevEl =
          target.dataset.layoutType === 'root'
            ? target
            : newTarget.__draggable_component__
            ? newTarget.children[0]
            : newTarget.parentNode
        prevSortable = state._sortable
        inserRowIndex = 0
        this.setBorder(prevEl, 'drag-line-top')
      } else {
        if (/^(root|grid-col)$/.test(target.dataset.layoutType)) {
          const rows = el.children
          prevEl = this.lastChild(el)
          if (prevEl === dragEl.parentNode.parentNode && list.length === 1) {
            prevEl = ''
            return false
          }
          this.setBorder(prevEl, 'drag-line-bottom')
          inserRowIndex = rows.length
          prevSortable = state._sortable
        }
        if (target.dataset.layoutType === 'inline') {
          if (this.disableBothSides(ER)) return false
          const cols = el.children
          prevEl = this.lastChild(el)
          if (prevEl.contains(dragEl) && list.length === 1) {
            prevEl = ''
            return false
          }
          inserColIndex = cols.length
          prevSortable = state._sortable
          this.setBorder(prevEl, 'drag-line-right')
        }
      }
    } else {
      this.setStates(newTarget, e, ER)
    }
  }
  setPcLayout(layout) {
    this._pcLayout = layout
  }
  setMobileLayout(layout) {
    this._mobileLayout = layout //
  }
  async clearValidate() {
    const form: FormInstance = this.getRef('form')
    form.clearValidate()
  }
  getSubForm(id: string) {
    if (typeof id == 'object') {
      //@ts-ignore
      id = id.id
    }
    let item = this.items.find((item) => {
      return item.id == id
    })
    let subForm = item.subForm
    return subForm
  }
  async validate() {
    return new Promise(async (resolve, reject) => {
      let form: VxeFormInstance = this.getRef('form')
      form.validate((err) => {
        console.log(err, 'testErr') //
      })
      // form.validate().catch(err => {
      //     reject(err)
      // })
    }).catch((err) => {
      console.log(err, '报错了') //
    })
  }
  getPluginName() {
    let id = this.id.slice(0, 4) //
    let plugin = `ControlInsertion_${id}`
    return plugin
  }
  getValidateRules() {
    let items = this.items
    let itemsRules = items
      .map((item) => {
        let rule = item.getValidateRoles()
        return rule
      })
      .reduce((res: any, rule) => {
        let field = rule.field
        let rules = rule.rules
        res[field] = rules
        return res
      }, {}) //
    return itemsRules //
  }
  setCurrentDesign(status: boolean = true) {
    let _state = Boolean(status)
    this.isDesign = _state //
  }
  getIsDesign() {
    return this.isDesign
  }
  runTestMethod() {
    let d = this.getLayoutData() //
    // let plugin = ControlInsertionPlugin(this)
    // Sortable.mount(plugin) //
  }
  init() {
    super.init()
    let pageType = this.pageType

    let config = this.config //
    if (!isReadonly(config)) {
      if (pageType == 'form') {
        let _props = getDefaultFormEditProps()
        let obj = {} //
        Object.entries(_props).forEach(([key, value]) => {
          //@ts-ignore
          let _default = value.default
          if (typeof _default == 'function' && value.type != Function) {
            //@ts-ignore
            _default = _default() //
          }
          obj[key] = _default //
        })
        Object.entries(obj).forEach(([key, value]) => {
          if (config[key] == null && value != null) {
            //
            config[key] = value
          }
        })
      }
    }
    this.initMobileLayout()
    this.initState() //
    let items = config.items || config.fields || []
    let _data = config.data //
    if (_data) {
      this.setData(_data) //
    }
    this.setItems(items, true) ////
  } //
  setState(state) {
    this.state = state //
  }
  getDesignFieldConfig() {
    //@ts-ignore
    let value = createFieldConfig(this)
    return value
  }
  initState() {
    let _config = createGlobalConfig()
    _config.id = this.uuid()
    _config.type = 'root' //
    let state = {
      validate: null as any,
      store: [],
      selected: {},
      mode: 'edit',
      platform: 'pc',
      children: [],
      //@ts-ignore
      config: _config, //
      previewVisible: false,
      widthScaleLock: false,
      data: {},
      validateStates: [],
      fields: [],
      Namespace: 'formEditor',
      logic: {},
      othersFiles: {},
      fieldsLogicState: new Map(),
    }
    this.state = state //
  }

  getFields() {
    let items = this.items
    let _items = items.map((item) => item.getOptionField())
    return _items
  }
  getDropMenuItems(node) {
    let arr = []
  }
  getBarsValue() {
    let parent = this.parent
    let title = this.getCurrentTabName()
    let arr = [{ title: title, formId: this.id }]
    if (parent != null) {
      let _arr = parent.getBarsValue()
      arr.unshift(..._arr)
    }
    return arr
  } //
  getFormArr() {
    let parentArr = this.getParentFormArr()
    let nextForm = this.getNextFormArr()
    return [...parentArr, this, ...nextForm] //
  }
  getFieldsDesignConfig() {
    let _fieldConfig = JSON.parse(JSON.stringify(fieldsConfig))
    return _fieldConfig
  }
  getNextFormArr() {
    let arr = []
    let nextForm = this.nextForm
    if (nextForm) {
      arr.push(nextForm)
      arr.push(...nextForm.getNextFormArr())
    }
    return arr
  }
  getParentFormArr() {
    let arr = []
    let parent = this.parent
    if (parent) {
      arr.push(parent)
      arr.push(...parent.getParentFormArr())
    }
    return arr
  } //
  formTabClick(id: string) {
    let allForm = this.getFormArr()
    let _f = allForm.find((form) => {
      //
      return form.id == id
    })
    let nextForms = _f.getNextFormArr()
    nextForms.forEach((form) => {
      form.nextForm = null
    }) //
    _f.nextForm = null //
  }
  closeCurSubForm() {}
  getCurrentTabName() {
    let curFormItem = this.curFormItem
    if (curFormItem == null) {
      return this.getTitle()
    }
    return curFormItem.getTitle()
  }
  getTitle() {
    //这是子表单
    let formItem = this.curFormItem
    let title = ''
    if (formItem != null) {
      title = formItem.getTitle()
    }
    title = title || '数据表单'
    return title ////
  }
  getRootForm() {
    let parent = this.parent
    if (parent != null) {
      return parent.getRootForm()
    } else {
      return this
    }
  }
  getFormConfig() {
    let obj: any = {}
    obj.config = this.submitConfig
    obj.fields = this.getFields()
    let pcLayout = this.getPcLayout()
    let mobileLayout = this.getMobileLayout()
    obj.layout = {
      pc: [pcLayout],
      mobile: mobileLayout,
    } //
    obj.data = this.getData() //
    return obj
  }
  createTrRow(): TableRow {
    let id = this.uuid()
    let key = `tr_${id}`
    let tr = {
      type: 'tr',
      columns: [],
      style: {},
      id,
      key,
    }
    return tr
  }
  getPcLayout() {
    let items = this.items
    let _pcLayout = this._pcLayout
    if (_pcLayout != null) {
      return _pcLayout //
    }
    let rootInline = {
      ...this.createNodeIdKey('inline'),
      columns: [],
      style: {},
    }
    let _index = 0
    let _rows = rootInline.columns
    if (items.length == 0) {
      return [] //
    }
    for (const item of items) {
      let index = item.getRowIndex()
      let _row = _rows[index]
      if (_row == null) {
        _row = {
          ...this.createNodeIdKey('grid'),
          columns: [],
          options: {
            gutter: 0,
            justify: 'start', //
            align: 'top',
          },
          style: {
            width: '100%',
          },
        } //
        _rows[index] = _row //
        _index = 0
      }
      let span = item.getSpan()
      let colLayout = {
        ...this.createNodeIdKey('col'),
        options: {
          span,
          offset: 0,
          pull: 0,
          push: 0,
        },
        list: [
          {
            ...this.createNodeIdKey('inline'),
            columns: [item.id],
          },
        ], //
      }
      _row.columns.push(colLayout)
    } //
    return [rootInline] //
  }
  createNodeIdKey(type) {
    let id = this.uuid()
    let key = `${type}_${id}`
    let obj = {
      id,
      key,
      type,
    }
    return obj
  }
  getMobileLayout() {
    let mobileLayout = []
    //清零
    let _mobileLayout = this._mobileLayout
    if (_mobileLayout != null) {
      return _mobileLayout //
    } //
    let items = this.items
    for (const item of items) {
      let _mobileLayout = item.mobileColumns
      mobileLayout.push(..._mobileLayout)
    }
    this.mobileLayout = mobileLayout
    return mobileLayout
  }
  initPcLayout() {
    let pcLayout = this.pcLayout
  }
  initMobileLayout() {}
  addFormItem(config: Field) {
    // debugger//
    let id = config.id
    let oldItems = this.items
    let index = oldItems.findIndex((item) => item.id === id)
    if (index !== -1) {
      return
    } //
    let _item = new FormItem(config, this)
    //@ts-ignore
    this.items.push(_item) //
    return _item
  }
  delFormItem(id) {
    if (typeof id == 'string') {
      //
      let index = this.items.findIndex((item) => item.id === id)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
      let nextFormMap = this.nextFormMap
      delete nextFormMap[id] //
      return
    }
    let index = this.items.findIndex((item) => item.config === id)
    if (index !== -1) {
      let s = this.items.splice(index, 1)
      let t = s[0]?.id
      let nextFormMap = this.nextFormMap
      delete nextFormMap[t] //
    }
  }
  getItemSpan() {
    let config = this.config
    let span = config.itemSpan //
    if (span == null) {
      span = 6
    }
    return span //
  }
  getLayoutRows() {
    let layout = this.pcLayout
    let tableIns = layout.columns[0] as Table
    let rows = tableIns.rows
    return rows
  }
  onMounted() {
    let fConfig = this.getFormConfig() //
    this.setData(fConfig)
  }
  onUnmounted() {
    super.onUnmounted() //
    this.unmountedPlugin() //
  }
  setData(data) {
    this.data = data
  }
  setEditData(data) {}
  switchPlatform(platform) {
    let props = this.config
    let state = this.state
    if (state.platform === platform) {
      return false
    }
    if (props.layoutType === 2) {
      this.syncLayout(platform, (newData) => {
        state.store = newData
        state.store.forEach((e) => {
          utils.addContext({ node: e, parent: state.store })
        })
      })
    }
    state.platform = platform
  }
  syncLayout(platform, fn) {
    let state = this.state
    let layout = this.layout
    const isPc = platform === 'pc'
    const original = _.cloneDeep(state.store)
    utils.disassemblyData2(original)
    layout[isPc ? 'mobile' : 'pc'] = original
    if (_.isEmpty(isPc ? layout.pc : layout.mobile)) {
      const newData = state.fields
        .filter((field) => !utils.checkIsInSubform(field))
        .map((e) => this.wrapElement(e, true, false, false, false))
      fn && fn(newData)
    } else {
      const layoutFields = utils
        .pickfields(isPc ? layout.pc : layout.mobile)
        .map((e) => {
          return {
            id: e,
          } //
        })
      const copyData = _.cloneDeep(isPc ? layout.pc : layout.mobile)
      const addFields = _.differenceBy(
        state.fields.filter((field) => !utils.checkIsInSubform(field)),
        layoutFields,
        'id',
      )
      const delFields = _.differenceBy(layoutFields, state.fields, 'id')
      utils.repairLayout(copyData, delFields)
      utils.combinationData2(copyData, state.fields)
      copyData.push(
        ...addFields.map((e) => this.wrapElement(e, true, false, false, false)),
      )
      fn && fn(copyData)
    }
  }
  setNodes(config: { lists: any[] }) {
    const lists = config.lists
    const _nodes = lists.map((e) => {
      let _node = new Node(e, this)
      return _node
    })
    this.state.store = _nodes //
  }
  flatNodes(nodes, excludes, fn?: any, excludesFn?: any) {
    return nodes.reduce((res, node, currentIndex) => {
      //不是field的node
      if (excludes.indexOf(node.type) === -1) {
        res.push(node)
        fn && fn(nodes, node, currentIndex)
      } else {
        excludesFn && excludesFn(nodes, node, currentIndex)
      }
      const children =
        node.list || node.rows || node.columns || node.children || []
      res = res.concat(this.flatNodes(children, excludes, fn, excludesFn))
      return res
    }, []) //
  }
  combinationData2(list, fields) {
    const fn = (nodes, node, currentIndex) => {
      let cur = fields.find((item) => item.id === node)
      if (!_.isEmpty(cur)) {
        nodes[currentIndex] = cur
      }
    }
    this.flatNodes(list, excludes, fn)
  }
  setLayoutData(data) {
    const state = this.state
    if (data == null) {
      return
    }
    if (state == null) {
      return
    } //
    let newData = data
    let layout = this.layout
    layout.pc = newData.layout.pc
    layout.mobile = newData.layout.mobile
    this.isShow = false
    state.store = newData.list
    state.fields = newData.fields
    let curLayout = _.cloneDeep(newData.layout[state.platform])
    if (state.fields == null) {
      // debugger//
    }
    utils.combinationData2(curLayout, state.fields)
    state.store = curLayout
    state.config = newData.config || state.config
    state.data = newData.data || state.data
    state.logic = newData.logic || state.logic //
    this.setSelection(state.config)
    state.store.forEach((e) => {
      utils.addContext({
        node: e,
        parent: state.store,
        form: this,
        formIns: this,
      }) //
    }) //
    nextTick(() => {
      this.isShow = true
    })
  }
  setSelection(node) {
    let state = this.state
    if (node == null) {
      node = 'root' //
    }
    if (state == null) {
      return
    }
    let result = ''
    if (node === 'root') {
      result = state.config
    } else {
      if (node.type === 'inline') {
        result = node.columns[0]
      } else {
        result = node
      }
    }
    if (result == state.selected) {
      return
    }
    let oldType = state.selected?.type
    //@ts-ignore
    let newType = result?.type
    if (oldType != newType) {
      let _t = this.dFormMap[newType]
      let _t1 = this.sFormMap[newType]
      if (_t) {
        this.curDForm = _t
      } else {
        this.curDForm = null
      }
      if (_t1) {
        this.curSForm = _t1
      } else {
        this.curSForm = null //
      }
    }
    this.isShowConfig = state.selected === result
    state.selected = result
    nextTick(() => {
      this.isShowConfig = true
    })
  }
  addField(node) {
    let state = this.state
    if (utils.checkIsField(node)) {
      const findIndex = _.findIndex(state.fields, {
        id: node.id,
      })
      if (findIndex === -1) {
        state.fields.push(node)
      } else {
        state.fields.splice(findIndex, 1, node)
      }
    }
  }
  delField(node) {
    let state = this.state
    const fieldIndex = _.findIndex(state.fields, {
      id: node.id,
    })
    if (fieldIndex !== -1) {
      if (utils.checkIdExistInLogic(node.id, state.logic)) {
        utils.removeLogicDataByid(node.id, state.logic)
      }
      state.fields.splice(fieldIndex, 1)
    }
  }
  addFieldData(node, isCopy = false) {
    let state = this.state
    if (/^(radio|cascader|checkbox|select)$/.test(node.type)) {
      if (isCopy) {
        state.data[node.id] = _.cloneDeep(state.data[node.options.dataKey])
        node.options.dataKey = node.id
      } else {
        if (!state.data[node.id]) {
          node.options.dataKey = node.id
          state.data[node.id] = {
            type: node.type,
            list: utils.generateOptions(3).map((e, i) => {
              e.label += i + 1
              return e
            }),
          }
        }
      }
    }
    let props = this.config
    if (/^(uploadfile|signature|html)$/.test(node.type)) {
      node.options.action = props.fileUploadURI
    }
  }
  wrapElement(
    el,
    isWrap = true,
    isSetSelection = true,
    sourceBlock = true,
    isInRoot = false,
  ) {
    let node: any = null //
    if (sourceBlock) {
      // 如果 sourceBlock 为 true，则调用 generatorData 生成数据，并为节点添加字段数据和字段
      node = generatorData(el, isWrap, this.lang, sourceBlock, (node) => {
        this.addFieldData(node)
        this.addField(node)
      })
    } else if (isWrap) {
      // 如果 isWrap 为 true（但 sourceBlock 为 false），则将元素封装为一个 'inline' 类型的对象
      node = {
        type: 'inline',
        columns: [el], // 将元素作为 columns 数组的元素
      }
    } else {
      // 如果 sourceBlock 和 isWrap 都为 false，直接返回原始元素
      node = el
    }
    if (isSetSelection) {
    }
    if (isInRoot) {
      let _node = {
        ...this.createNodeIdKey('inline'),
        columns: [
          {
            ...this.createNodeIdKey('grid'),
            options: {
              gutter: 0,
              justify: 'start',
              align: 'top',
            },
            style: {
              width: '100%',
            },
            columns: [
              {
                ...this.createNodeIdKey('col'), //
                list: [node],
                options: {
                  span: 6, //
                  offset: 0,
                  push: 0,
                  pull: 0,
                  style: {},
                },
              },
            ],
          },
        ],
      }
      let _node1 = node
      //@ts-ignore
      _node._getSelectTarget = () => _node1 //
      node = _node //
    }
    return node
  }
  getLabelWidth() {
    return 20
  }
  getLayoutDataByplatform(platform) {
    const isPc = platform === 'pc'
    let layout = this.layout
    let state = this.state
    if (_.isEmpty(isPc ? layout.pc : layout.mobile)) {
      if (platform === state.platform) {
        const original = _.cloneDeep(state.store)
        utils.disassemblyData2(original)
        return original
      } else {
        const newData = _.cloneDeep(
          state.fields
            .filter((field) => !utils.checkIsInSubform(field))
            .map((e) => this.wrapElement(e, true, false, false, false)),
        )
        utils.disassemblyData2(newData)
        return newData
      }
    } else {
      if (platform === state.platform) {
        const original = _.cloneDeep(state.store)
        utils.disassemblyData2(original)
        layout[isPc ? 'pc' : 'mobile'] = original
      }
      const layoutFields = utils
        .pickfields(isPc ? layout.pc : layout.mobile)
        .map((e) => {
          return {
            id: e,
          }
        })
      const copyData = _.cloneDeep(isPc ? layout.pc : layout.mobile)
      const addFields = _.cloneDeep(
        _.differenceBy(
          state.fields.filter((field) => !utils.checkIsInSubform(field)),
          layoutFields,
          'id',
        ).map((e) => this.wrapElement(e, true, false, false, false)),
      )
      const delFields = _.differenceBy(layoutFields, state.fields, 'id')
      utils.repairLayout(copyData, delFields)
      utils.disassemblyData2(addFields)
      copyData.push(...addFields)
      return copyData
    }
  }
  unmountedPlugin() {
    let cachePlugin = this.cachePlugin
    if (cachePlugin) {
      Sortable.unmounted(cachePlugin.pluginName)
    }
  }
  getData() {
    let data = null
    data = this.config.data
    if (data == null) {
      let _data1 = this.originalData
      return _data1 //
    }
    return data //
  }
  clearData() {
    let layout = this.layout
    let state = this.state
    layout.pc = []
    layout.mobile = []
    state.fields.splice(0)
    state.store.splice(0)
  }
  getLayoutData() {
    let layout = this.layout
    let state = this.state
    const fields = utils.processField(_.cloneDeep(state.store))
    layout.pc = this.getLayoutDataByplatform('pc')
    layout.mobile = this.getLayoutDataByplatform('mobile')
    return _.cloneDeep({
      layout,
      data: state.data,
      config: state.config,
      fields,
      logic: state.logic,
    })
  }
  getIsPc() {
    return this.state.platform === 'pc'
  }
  getShowFormBar() {
    let items = this.items
    let hasSubFormItem = items.some((item) => item.subForm != null)
    return hasSubFormItem
  }
  getTargetProps() {
    let state = this.state
    let props = this.config
    const formIns: any = this
    const type = computed(() => state.selected?.type)
    const col = computed(() => state.selected?.context?.col ?? null)

    const isSelectRoot = computed(() => state.selected === state.config)
    const isSelectAnyElement = computed(() => !isSelectRoot.value)
    const isPc = computed(() => state.platform === 'pc')
    const isEditModel = computed(() => {
      let value = /^(edit|config)$/.test(state.mode)
      let isDesign = formIns.isDesign
      return value && isDesign
    }) //

    const checkTypeBySelected = (nodes: string[], propType?: any) => {
      if (!state.selected) return false
      const fn = props.checkPropsBySelected?.(state.selected, propType)
      return fn !== undefined ? fn : nodes.includes(type.value)
    }

    const createTypeChecker = (nodes: string[]) =>
      computed(() => checkTypeBySelected(nodes))
    let setSelection = this.setSelection.bind(this)
    return {
      state,
      setSelection,
      type,
      col,
      selection: computed(() => state.selected),
      target: computed(() => state.selected),
      isSelectAnyElement,
      isSelectRoot,
      isPc,
      isEditModel,
      isSelectField: computed(() => utils.checkIsField(state.selected)),
      isSelectGrid: createTypeChecker(['grid']),
      isSelectTabs: createTypeChecker(['tabs']),
      isSelectCollapse: createTypeChecker(['collapse']),
      isSelectTable: createTypeChecker(['table']),
      isSelectSubform: createTypeChecker(['subform']),
      checkTypeBySelected,
    }
  }
  getWindowScrollingElement() {
    const scrollingElement = document.scrollingElement
    if (scrollingElement) {
      return scrollingElement
    } else {
      return document.documentElement
    }
  }
  getParentAutoScrollElement(el, includeSelf) {
    // skip to window
    if (!el || !el.getBoundingClientRect)
      return this.getWindowScrollingElement()
    let elem = el
    let gotSelf = false
    do {
      // we don't need to get elem css if it isn't even overflowing in the first place (performance)
      if (
        elem.clientWidth < elem.scrollWidth ||
        elem.clientHeight < elem.scrollHeight
      ) {
        const elemCSS = this.css(elem)
        if (
          (elem.clientWidth < elem.scrollWidth &&
            (elemCSS.overflowX === 'auto' || elemCSS.overflowX === 'scroll')) ||
          (elem.clientHeight < elem.scrollHeight &&
            (elemCSS.overflowY === 'auto' || elemCSS.overflowY === 'scroll'))
        ) {
          if (!elem.getBoundingClientRect || elem === document.body)
            return this.getWindowScrollingElement()

          if (gotSelf || includeSelf) return elem
          gotSelf = true
        }
      }
      /* jshint boss:true */
      // eslint-disable-next-line
    } while ((elem = elem.parentNode))

    return this.getWindowScrollingElement()
  }
  css(el, prop?: any, val?: any) {
    const style = el && el.style

    if (style) {
      // eslint-disable-next-line
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '')
        } else if (el.currentStyle) {
          val = el.currentStyle
        }
        // eslint-disable-next-line
        return prop === void 0 ? val : val[prop]
      } else {
        if (!(prop in style) && prop.indexOf('webkit') === -1) {
          prop = '-webkit-' + prop
        }

        style[prop] = val + (typeof val === 'string' ? '' : 'px')
      }
    }
  }
  disableBothSides(ER) {
    //
    return ER.props.layoutType === 1 && ER.state.platform === 'mobile'
  }
  getDirection1(target, originalEvent) {
    let direction: any = ''
    const Y = this.getOffset(target, 'offsetTop')
    const scrollEl = this.getParentAutoScrollElement(target, true)
    const clientY = originalEvent.clientY + scrollEl.scrollTop
    const h = target.offsetHeight
    if (clientY > Y && clientY < Y + h / 2) {
      direction = 5
    } else {
      direction = 6
    }
    return direction
  }
  getOffset = (el, key) => {
    let offset = 0
    let parent = el

    while (parent) {
      offset += parent[key]
      parent = parent.offsetParent
    }

    return offset
  }
  lastChild(el, selector?: any) {
    let last = el.lastElementChild
    // eslint-disable-next-line
    while (
      last &&
      (this.css(last, 'display') === 'none' ||
        (selector && !this.matches(last, selector)))
    ) {
      last = last.previousElementSibling
    }
    return last || null
  }
  matches(/** HTMLElement */ el, /** String */ selector) {
    if (!selector) return

    selector[0] === '>' && (selector = selector.substring(1))

    if (el) {
      try {
        if (el.matches) {
          return el.matches(selector)
        } else if (el.msMatchesSelector) {
          return el.msMatchesSelector(selector)
        } else if (el.webkitMatchesSelector) {
          return el.webkitMatchesSelector(selector)
        }
      } catch (_) {
        return false
      }
    }

    return false
  }
  getDirection0(target, originalEvent) {
    let direction: any = ''
    const X = this.getOffset(target, 'offsetLeft')
    const Y = this.getOffset(target, 'offsetTop')
    const scrollEl = this.getParentAutoScrollElement(target, true)
    const clientX = originalEvent.clientX
    const clientY = originalEvent.clientY + scrollEl.scrollTop
    const w = target.offsetWidth
    const h = target.offsetHeight
    const x1 = X
    const y1 = -Y
    const x2 = x1 + w
    const y2 = y1 - h
    const x0 = (x1 + x2) / 2
    const y0 = (y1 + y2) / 2
    const k = (y2 - y1) / (x2 - x1)
    const x = clientX
    const y = -clientY
    const K = (y - y0) / (x - x0)
    if (k < K && K < -k) {
      if (x > x0) {
        direction = 2
      } else {
        direction = 4
      }
    } else {
      if (y > y0) {
        direction = 1
      } else {
        direction = 3
      }
    }
    return direction
  }
  clearBorder(el) {
    const classNames = ['top', 'bottom', 'left', 'right']
    classNames.forEach((e) => {
      el.classList.remove(`drag-line-${e}`)
    })
  }
  setBorder(el, className) {
    this.clearBorder(el)
    el.classList.add(className)
  }
  setStates(newTarget, ev, ER) {
    const {
      activeSortable: {
        constructor: { utils },
        options: { dataSource },
        el: {
          __draggable_component__: { list },
        },
      },
      activeSortable,
      target,
      originalEvent,
      dragEl,
      sortable: {
        el,
        el: {
          __draggable_component__: {
            //list是横向的东西
            //columns是纵向的
            list: targetList, //获取到sort的dom的list变量
          },
        },
      },
      sortable,
    } = ev
    let _targetList = ev.sortable.el.__draggable_component__
    const targetContainer = el.parentNode
    const direction = this.disableBothSides(ER)
      ? this.getDirection1(newTarget, originalEvent)
      : this.getDirection0(newTarget, originalEvent)
    const cols = newTarget.parentNode.children
    const colIndex = utils.index(newTarget)
    const rows = targetContainer.parentNode.children
    const rowIndex = utils.index(targetContainer)
    if (/^(2|4)$/.test(direction)) {
      if (targetList.length === ER.props.inlineMax && !el.contains(dragEl)) {
        return false
      }
    }
    if (/^(1)$/.test(direction)) {
      if (ER.state.store.length > 0 && /^(root)$/.test(el.dataset.layoutType)) {
        return false
      }
    }
    switch (direction) {
      case 1:
        if (
          (list.length === 1 &&
            rows[rowIndex - 1] &&
            rows[rowIndex - 1].contains(dragEl)) ||
          !sortable.el.parentNode.parentNode.__draggable_component__
        ) {
          prevEl = ''
          return false
        }
        prevSortable =
          sortable.el.parentNode.parentNode.__draggable_component__._sortable
        prevEl = targetContainer
        inserRowIndex = utils.index(prevEl)
        this.setBorder(prevEl, 'drag-line-top')
        break
      case 2:
        if (cols[utils.index(target) + 1] !== dragEl) {
          if (colIndex === targetList.length - 1) {
            prevEl = newTarget
            prevSortable = sortable
            inserColIndex = utils.index(prevEl) + 1
            this.setBorder(prevEl, 'drag-line-right')
          } else {
            prevSortable = sortable
            prevEl = cols[colIndex + 1]
            inserColIndex = utils.index(prevEl)
            this.setBorder(prevEl, 'drag-line-left')
          }
        }
        break
      case 3:
        if (sortable.el.dataset.layoutType === 'root') {
          return false
        }
        prevSortable =
          sortable.el.parentNode.parentNode.__draggable_component__._sortable
        if (rowIndex === rows.length - 1) {
          prevEl = targetContainer
          this.setBorder(prevEl, 'drag-line-bottom')
        } else {
          prevEl = rows[rowIndex + 1]
          if (list.length === 1 && rows[rowIndex + 1].contains(dragEl)) {
            prevEl = ''
            return false
          }
          this.setBorder(prevEl, 'drag-line-top')
        }
        inserRowIndex = utils.index(targetContainer) + 1
        break
      case 4:
        if (cols[utils.index(target) - 1] !== dragEl) {
          prevEl = newTarget
          prevSortable = sortable
          inserColIndex = utils.index(prevEl)
          this.setBorder(prevEl, 'drag-line-left')
        }
        break
      case 5:
        if (targetList.length === ER.props.inlineMax && !el.contains(dragEl)) {
          return false
        }
        if (cols[utils.index(target) - 1] !== dragEl) {
          prevEl = newTarget
          prevSortable = sortable
          inserColIndex = utils.index(prevEl)
          this.setBorder(prevEl, 'drag-line-top')
        }
        break
      case 6:
        // console.log('下')
        if (targetList.length === ER.props.inlineMax && !el.contains(dragEl)) {
          return false
        }
        if (cols[utils.index(target) + 1] !== dragEl) {
          if (colIndex === targetList.length - 1) {
            prevEl = newTarget
            prevSortable = sortable
            inserColIndex = utils.index(prevEl) + 1
            this.setBorder(prevEl, 'drag-line-bottom')
          } else {
            prevSortable = sortable
            prevEl = cols[colIndex + 1]
            inserColIndex = utils.index(prevEl)
            this.setBorder(prevEl, 'drag-line-top')
          }
        }
        break
    }
  }
  deleteNode(props) {
    let ER = this
    let state = ER.state
    if (ER.props.delHandle(props.data) === false) return false
    props.data.context.delete()
    utils.deepTraversal(props.data, (node) => {
      if (utils.checkIsField(node)) {
        ER.delField(node)
      }
    })
    if (/^(radio|checkbox|select)$/.test(props.data.type)) {
      delete state.data[props.data.options.dataKey]
    }
    if (props.parent.length > 0) {
      const index = props.parent.indexOf(props.data)
      this.setSelection(
        index === props.parent.length
          ? props.parent[index - 1]
          : props.parent[index],
      )
    } else {
      this.setSelection('root')
    }
  }
  copyNode(props) {
    let ER = this
    if (ER.props.copyHandle(props.data) === false) return false
    props.data.context.copy()
    const index = props.parent.indexOf(props.data)
    const copyData = props.parent[index + 1]
    this.setSelection(copyData)
    utils.deepTraversal(copyData, (node) => {
      ER.addFieldData(node, true)
      if (utils.checkIsField(node)) {
        ER.addField(node)
      }
    })
  }
  tableInsertRow(props) {
    //@ts-ignore
    _.last(props.data.context.columns[0]).context.insert('bottom')
  }
  tableInsertCol(props) {
    _.last(props.data.context.columns)[0].context.insert('right')
  }
  topNode(props) {
    let parent = props.data.context.parent
    if (/^(inline|tr)$/.test(parent.type)) {
      parent = parent.context.parent
    }
    this.setSelection(Array.isArray(parent) ? 'root' : parent)
  }
  enterForm(props) {
    // let formIns = this
    // let id = props.data.id
    // let subForm = formIns.getSubForm(id)
    // if (subForm != null) {
    //   formIns.nextForm = subForm //
    // }
  }
  resetContext() {
    // let platform = this.state.platform
    let state = this.state
    state.store.forEach((e) => {
      utils.addContext({ node: e, parent: state.store })
    })
  }
  checkIslineChildren(node) {
    if (node.context == null) {
      this.resetContext() //
    }
    return node.context.parent.type === 'inline'
  }
  syncWidthByPlatform(node, platform, syncFullplatform = false, value) {
    const isArray = _.isArray(node)
    if (!isArray) {
      if (_.isObject(node.style.width)) {
        if (syncFullplatform) {
          node.style.width.pc = node.style.width.mobile = value + '%'
        } else {
          node.style.width[platform] = value + '%'
        }
      } else {
        node.style.width = value + '%'
      }
    }
  }
  calculateAverage(count, total = 100) {
    const base = Number((total / count).toFixed(2))
    const result = []
    for (let i = 0; i < count; i++) {
      result.push(base)
    }
    return result
  }
  syncHeightByPlatform(node, platform, syncFullplatform = false, value) {
    node.style.height = value
    const otherNodes = node.context.parent.columns.filter((e) => e !== node)
    otherNodes.forEach((node, index) => {
      node.style.height = value //
    })
  }
  designForm(props: any) {
    let data = props.data
    let id = data.id
    let items = this.items
    let item = items.find((item) => item.id === id)
    if (item) {
      item.designForm()
    }
  }
  dragWidth(props: any) {}
  getRealTableName() {
    return ''
  }
  initDefaultDForm() {
    // let tm1 = selectTypeMap(this as any) //
    // Object.entries(tm1).forEach(([key, value]) => {
    //   let _f = new Form(value)
    //   this.sFormMap[key] = _f ////
    // }) //
    let _this: any = this //
    let tm = formitemTypeMap(_this)
    Object.entries(tm).forEach(([key, value]) => {
      let _f = new Form(value)
      this.dFormMap[key] = _f
    })
    let tm1 = selectTypeMap(_this)
    Object.entries(tm1).forEach(([key, value]) => {
      let _f = new Form(value)
      this.sFormMap[key] = _f ////
    }) //
  }
  getHeaderButtons() {
    let buttons = this.config.buttons
    if (buttons == null) {
      return []
    }
    let _btns = buttons.map((btn) => btn) //
    return _btns //
  }
  getCurrentPageDesign() {
    let system = this.getSystem()
    let dTableName = this.dTableName
    let tableMap = system.tableMap
    let tableEditMap = system.tableEditMap
    let design = tableMap[dTableName]
    if (design == null) {
      design = tableEditMap[dTableName]
    }
    return design
  }
  getFieldComButtons() {
    let btns = [
      {
        label: '添加默认字段',
        fn: async () => {
          let pageDesign = this.getCurrentPageDesign()
          let columns = pageDesign.getTableColumns()
          // console.log(columns, 'testColumns') //
        },
      },
    ]
    return btns
  }
}
//使用默认布局

export const createLayoutData = (data): FormLayout => {
  return {} as any
}
