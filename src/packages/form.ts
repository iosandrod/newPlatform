import { computed, defineComponent, nextTick, reactive, shallowRef } from 'vue'
import formEditor from '@ER/formEditor/formEditor'
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
export class Form extends Base {
  lang: any = {}
  t: any
  state: any
  isShow: boolean = true
  isDesign = true //
  data: any = {} //
  config: any = {}
  curFormItem?: FormItem
  parent?: Form //
  isShowConfig: boolean = true
  formData: any
  nextForm?: Form
  nextFormMap: any = {}
  items: FormItem[] = []
  pcLayout: Layout = {
    type: 'inline',
    columns: [
      {
        type: 'table',
        label: '表格布局',
        icon: 'tableStokeP2',
        id: null,
        key: null,
        rows: [],
        style: {},
        options: {
          width: 100,
          widthType: '%',
        },
      },
    ],
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
  constructor(config) {
    super()
    this.config = config
    this.init()
  } //
  getButtons() {
    let config = this.config
    let buttons = config.buttons || []
    return buttons
  }
  setItems(items, setLayout = true) {
    // debugger//
    this.items.splice(0) //
    for (const item of items) {
      this.addFormItem(item) //
    }
    if (setLayout == true) {
      let pcLayout = this.getPcLayout()
      let mobileLayout = this.getMobileLayout()
      let layout = {
        pc: [pcLayout],
        mobile: mobileLayout,
      }
      let fields = this.getFields()
      let obj = {
        fields,
        layout,
        list: [], //
      }
      this.setLayoutData(obj) //
      //   nextTick(() => {
      //   })
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
      // let form = this.getRef('form')
      // form.validate().catch(err => {
      //     reject(err)
      // })
    }).catch((err) => {
      console.log(err, '报错了') //
    })
  }
  getPluginName() {
    let id = this.id
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
    this.isDesign = status //
    // let d = this.getData()
  }
  runTestMethod(){
    // let d=this.getData()
    let d=this.getLayoutData()//
    console.log(d)
  }
  init() {
    super.init()
    let config = this.config
    this.initPcLayout()
    this.initMobileLayout()
    this.initState() //
    let items = config.items || config.fields || []
    let _data = config.data //
    if (_data) {
      this.setData(_data) //
    }
    this.setItems(items) //
    nextTick(() => {
      // this.setLayoutData(JSON.parse(JSON.stringify(testData1))) //
    })
  } //
  setState(state) {}
  getDesignFieldConfig() {
    return createFieldConfig()
  }
  initState() {
    let state = {
      validate: null as any,
      store: [],
      selected: {},
      mode: 'edit',
      platform: 'pc',
      children: [],
      //@ts-ignore
      config: createGlobalConfig(),
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
    let rows = []
    let _pcLayout = this._pcLayout
    if (_pcLayout != null) {
      return _pcLayout //
    }
    let _index = 0
    for (const item of items) {
      let index = item.getRowIndex()
      let _row = rows[index]
      if (_row == null) {
        let nRow = this.createTrRow()
        rows[index] = nRow
        let initCols = Array(24)
          .fill(null)
          .map((row, i) => {
            let id = this.uuid()
            return {
              type: 'td',
              style: {},
              options: {
                colspan: 1,
                rowspan: 1,
                isMerged: false,
              },
              id: id,
              key: `td_${id}`,
              list: [],
            }
          })
        nRow.columns.push(...initCols)
        _row = nRow
        _index = 0
      }
      let _cols = item.getTdColumn()
      let span = item.getSpan()
      // _row.columns.push(...item.getTdColumn())
      _row.columns.splice(_index, span, ..._cols)
      _index += span //
    }
    let pcLayout = this.pcLayout
    pcLayout.columns[0].rows = rows
    if (pcLayout.columns[0].rows.length == 0) {
      let nRow = this.createTrRow()
      let td = Array(1)
        .fill(null)
        .map((row, i) => {
          let id = this.uuid()
          return {
            type: 'td',
            style: {},
            options: {
              colspan: 1,
              rowspan: 1,
              isMerged: false,
            },
            id: id,
            key: `td_${id}`,
            list: [],
          }
        })
      nRow.columns.push(...td)
      pcLayout.columns[0].rows.push(nRow) //
    }
    return pcLayout
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
    let id1 = this.uuid()
    let id2 = this.uuid()
    pcLayout.id = id1
    pcLayout.key = `inline_${id1}`
    pcLayout.columns[0].id = id2
    pcLayout.columns[0].key = `table_${id2}` //
  }
  initMobileLayout() {}
  addFormItem(config: Field) {
    let _item = new FormItem(config, this)
    this.items.push(_item) //
    return _item
  }
  delFormItem(id) {
    if (id == 'string') {
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
      // const newData = _.cloneDeep(state.fields.map(e => wrapElement(e, true, false)))
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
  setLayoutData(data) {
    const state = this.state
    if (data == null) {
      return
    }
    if (state == null) {
      return
    }
    let newData = data
    let layout = this.layout
    layout.pc = newData.layout.pc
    layout.mobile = newData.layout.mobile
    this.isShow = false
    state.store = newData.list
    state.fields = newData.fields
    const curLayout = _.cloneDeep(newData.layout[state.platform])
    utils.combinationData2(curLayout, state.fields)
    state.store = curLayout
    state.config = newData.config || state.config
    state.data = newData.data || state.data
    state.logic = newData.logic || state.logic //
    this.setSelection(state.config)
    state.store.forEach((e) => {
      utils.addContext({ node: e, parent: state.store })
    })
    nextTick(() => {
      this.isShow = true
    })
  }
  setSelection(node) {
    let state = this.state
    if (node == null) {
      node = 'root' //
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
    resetWidth = true,
  ) {
    let state = this.state
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
    if (!sourceBlock && resetWidth) {
      if (utils.checkIsField(el)) {
        if (state.platform === 'pc') {
          el.style.width.pc = '100%'
        } else {
          el.style.width.mobile = '100%'
        }
      } else {
        el.style.width = '100%'
      }
    }
    if (isSetSelection) {
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
  getData() {
    let data = this.config.data || {}
    return data
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
}
//使用默认布局

export const createLayoutData = (data): FormLayout => {
  return {} as any
}
