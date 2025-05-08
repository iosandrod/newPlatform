import { Arrayable } from 'element-plus/es/utils/typescript'
import { Base } from '@/base/base'
import { Form } from './form'
import { Field, TableCell, TableRow } from './layoutType'
import { FormItemRule, InputProps } from 'element-plus'
import { computed, isRef } from 'vue'
import { FormProps } from './hooks/use-props'
import dayjs from 'dayjs'
import { showToast } from 'vant'
import Region from '@ER/region/Region'
import _ from 'lodash'
import { areaList } from '@vant/area-data'
import { itemTypeMap } from './itemTypeMap'
import { erFormEditor } from './formEditor'
import { Dialog } from '@/dialog/dialog'
import { Table } from '@/table/table'
import tableCom from '@/table/tableCom'
import CodeEditor from '@/codeEditor/codeEditor'
import codeEditorCom from '@/codeEditor/codeEditorCom'

export type FormOptions = {
  items: Field[]
}

export class FormItem extends Base {
  eventManager = {}
  tableName: string
  oldValue: any
  field: Field = {} as any
  subForm?: Form
  form: Form
  config: Field | { [key: string]: any } //
  rowIndex: number //
  columns: TableCell[] = []
  mobileColumns: TableCell[] = []
  constructor(config: Field, form) {
    super()
    let id = config.id
    if (id != null) {
      this.id = id //
    }
    this.form = form
    this.config = config
    this.init() //初始化行列
  }
  getField() {
    let config = this.config
    let field = config.field
    if (field == null) {
      field = this.id
    }
    return field
  }
  updateBindData(updateConfig: { value: any; [key: string]: any }) {
    try {
      let value = updateConfig.value
      let field = this.getField()
      let updateBefore = this.config.updateBefore
      if (typeof updateBefore == 'function') {
        updateBefore(value)
      }
      let oldValue = this.getBindValue()
      let data = this.getData()
      if (oldValue == value) {
        return //
      }
      let _field1 = `_${field}_set`
      let dv = data?.[_field1]
      if (typeof dv == 'function') {
        dv(value) //
      } else {
        data[field] = value
      }
      // _.set(data, field, value) //
      //   data[field] = value //
    } catch (error) {
      console.log('更新数据报错了') //
    }
  }
  getItemChange() {}
  async onValueChange() {}
  getForm() {
    return this.form //
  }
  getSpan() {
    let options = this.config
    let span = options?.span
    let form = this.form //
    let _span = form.getItemSpan()
    if (span == null) {
      span = _span
    }
    return span
  }
  init() {
    super.init() //
    //处理列
    this.getTdColumn()
    //不影响form的属性
    // this.columns = tdRow//做一个缓存
    this.getRowIndex()
    //处理字段
    // let field = this.createField()
    // this.field = field
    let mobileRow = this.createMobileRow()
    this.mobileColumns = mobileRow //
    this.setSubForm()
  } //
  setSubForm() {
    let type = this.getType()
    let config = this.config
    let options = config.options
    if (type == 'Sform') {
      let formConfig = options?.formConfig || { items: [] } //
      const pProps = { ...this.form.props }
      Object.entries(pProps).forEach(([key, value]) => {
        if (formConfig[key]) return
        formConfig[key] = value
      })
      let _form = new Form(formConfig)
      _form.parent = this.form //
      this.subForm = _form //
      _form.curFormItem = this //
    }
  } //
  getSelectOptions() {
    let _options = this.getOptions()
    let options = _options?.options || []
    if (!Array.isArray(options)) {
      options = [] //
    }
    return options //
  }
  getSubForm(id: string) {}
  getData() {
    let form = this.form
    let data = form.getData()
    return data ////
  }
  getTdColumn(): TableCell[] {
    let span = this.getSpan()
    let tDList = Array(span)
      .fill(null)
      .map((row, i) => {
        let isMerge = i > 0 ? true : false
        let id = this.uuid()
        let key = `td_${id}`
        let list = []
        if (i == 0) {
          let iId = this.uuid()
          let iKey = `inline_${iId}`
          let fId = this.id
          let obj = {
            type: 'inline',
            columns: [fId],
            style: {},
            id: iId,
            key: iKey,
          }
          list.push(obj)
        } //
        let obj1: TableCell = {
          type: 'td',
          style: {},
          options: {
            colspan: span,
            rowspan: 1,
            isMerged: isMerge,
          },
          id,
          key,
          list: list, //
        }
        return obj1
      })
    this.columns = tDList
    return tDList //
  }
  createField() {
    let type = this.getType()
    let id = this.id
    let key = `${type}_${id}` //
    let config = this.config
    let field = { ...this.config, id: id, key: key, field: config.field }
    return field
  }
  createMobileRow() {
    let obj = [
      {
        type: 'inline',
        columns: [this.id],
      },
    ] as any
    return obj
  }
  getRowIndex() {
    let form = this.form
    let items = form.items
    let curIndex = items.findIndex((item) => item === this)
    if (curIndex === -1) {
      curIndex = items.length //
    }
    let preItems = items.slice(0, curIndex)
    let preSpans = preItems.map((item) => item.getSpan())
    let preSpan = preSpans.reduce((a, b) => a + b, 0) //
    let num = preSpan + this.getSpan()
    let rowIndex = 0
    if (num % 24 == 0) {
      rowIndex = num / 24 - 1
    } else {
      rowIndex = Math.floor((preSpan + this.getSpan()) / 24)
    }
    //做一个缓存
    this.rowIndex = rowIndex
    return rowIndex
  }
  getDefaultOptions() {
    return {} //
  }
  getOptionField() {
    let config = this.config
    if (config.id == null) {
      config.id = this.id
      config.key = this.getKey()
    }
    if (config.options == null) {
      config.options = this.getDefaultOptions()
    }
    if (config.type == null) {
      config.type = this.getType()
    }
    if (config.style == null) {
      config.style = this.getStyle()
    }
    // let id = this.id
    // let obj: any = {
    //   id: id,
    //   key: this.getKey(),
    // }
    // obj.options = obj.options || {}
    // const type = this.getType()
    // obj.type = obj.type || type
    // const style = this.getStyle()
    // obj.style = obj.style || style //
    // config.options = config.options || {}
    return config
  }
  getDisabled() {
    let disables = this.config?.options?.disabled
    return disables //
  }
  getClearable() {
    let clearable = this.config?.options?.clearable
    if (clearable == null) {
      clearable = true
    }
    return clearable
  }
  getRequired() {
    let required = this.config?.options?.required
    return required
  }
  getLabelWidth() {
    let config = this.config
    let labelWidth = config?.labelWidth
    if (labelWidth == null) {
      labelWidth = this.form.getLabelWidth()
    } //
    let _width = `${labelWidth}px`
    return _width
  }
  getStyle() {
    let config = this.config
    let style = config?.style || {
      width: {
        pc: '100%',
        mobile: '100%', //
      },
    }
    return style
  }
  getKey() {
    let config = this.config
    let id = this.id
    let type = this.getType()
    let key = `${type}_${id}`
    return key
  }
  getPlaceholder() {
    let config = this.config
    let placeholder = config?.options?.placeholder || '请输入'
    return placeholder
  }
  getBindConfig() {
    let type = this.getType() //
    let typeFn = itemTypeMap[type]
    let defaultMap = itemTypeMap['default']
    let obj = {}
    if (typeFn) {
      obj = typeFn(this)
    } else {
      obj = defaultMap(this)
    }
    if (type == 'select') {
    }
    return obj
  }
  getBindValue(getConfig?: any) {
    let data = this.getData() //
    let field = this.getField()
    let _field = `_${field}_get`
    let value1 = data[_field]
    let value = data[field]
    if (typeof value1 == 'function') {
      value = value1()
    } //
    if (getConfig) {
      return value
    }
    return value
  }
  getBindShowValue() {
    return '....' //
  }
  getTitle() {
    let config = this.config
    let label = config.label
    return label || '' //
  }
  getValidateRoles() {
    let field = this.getField()
    let r: FormItemRule = {
      //@ts-ignore
      trigger: 'blur',
      required: true,
      asyncValidator: async (rule, value, callback) => {
        //
      }, //
    }
    let rules = { field: field, rules: [r] } //
    return rules
  }
  getType() {
    let config = this.config
    let type = config.type
    if (type == null) {
      type = 'string'
    }
    return type
  }
  // getLabelWidth() {
  //     let config = this.config
  //     let labelWidth = config?.labelWidth
  //     if(labelWidth==null){
  //         let form=this.form
  //          labelWidth=form.getLabelWidth()
  //     }
  //     return labelWidth
  // }
  getFormItemProps(data, specialHandling?: any, isRoot = false) {
    let form = this.form
    let t = form.t
    const formIns: Form = form
    let state = form.state
    let isPc = formIns.getIsPc()
    let node = isRoot ? data.config : data
    let result = new FormProps({})
    result.formitem = this
    const item = formIns.items.find((item) => item.id === data.id) //
    result.formitem = item
    const platform = isPc ? 'pc' : 'mobile'
    if (isRoot) {
      if (isPc) {
        //
        result.model = data.store // is Array
        result.size = node.pc.size //
        result.labelPosition = node[platform].labelPosition
      } else {
        result.labelAlign = node[platform].labelPosition
      }
      return result
    }
    if (isRef(data)) {
      node = data.value
    }
    const { options } = node
    let result1 = {
      label: '',
      disabled: this.getDisabled(),
      placeholder: this.getPlaceholder(),
      clearable: this.getClearable(),
      required: this.getRequired(), //
    }
    Object.assign(result, result1) //
    //@ts-ignore
    result.prop = this.getField() ////
    if (isPc) {
      result.labelWidth = this.getLabelWidth() //
    }
    switch (node.type) {
      case 'input':
        if (options.isShowWordLimit) {
          result.maxlength = options.max
          result['show-word-limit'] = options.isShowWordLimit
        }
        if (isPc) {
          result.showPassword = options.showPassword
          result.prepend = options.prepend
          result.append = options.append
        } else {
          if (options.showPassword) {
            result.type = 'password'
          }
          if (options.renderType === 4) {
            result.type = 'tel'
          }
        }
        break
      case 'textarea':
        if (options.isShowWordLimit) {
          result.maxlength = options.max
          result['show-word-limit'] = options.isShowWordLimit
        }
        result.type = 'textarea'
        result.rows = options.rows
        break
      case 'number':
        if (isPc) {
          result.controls = options.controls
          if (options.controls) {
            result['controls-position'] = options.controlsPosition
              ? 'right'
              : ''
          }
        } else {
          // result.inputWidth = '100px'
          //@ts-ignore
          result.defaultValue = null
          //@ts-ignore
          result.allowEmpty = true
        }
        if (options.isShowWordLimit) {
          result.min = options.min
          result.max = options.max
        } else {
          result.min = Number.NEGATIVE_INFINITY
          result.max = Number.POSITIVE_INFINITY
        }
        result.step = options.step
        result.precision = options.precision
        break
      case 'radio':
      case 'checkbox':
        result.options = _.get(state, `data[${options.dataKey}].list`, [])
        break
      case 'select':
        result.options = _.get(state, `data[${options.dataKey}].list`, [])
        result.multiple = options.multiple
        result.filterable = options.filterable
        break
      case 'time':
        result.format = options.format
        if (isPc) {
          result.valueFormat = options.valueFormat
        }
        break
      case 'date':
        result.placeholder = options.placeholder
        result.format = options.format
        result.type = options.type
        if (isPc) {
          result.valueFormat = 'X'
          if (options.type === 'daterange') {
            result.rangeSeparator = ''
            result.startPlaceholder = options.placeholder
          }
          result.disabledDate = (time) => {
            const { startTime, endTime, isShowWeeksLimit } = options
            const startDate = dayjs.unix(startTime)
            const endDate = dayjs.unix(endTime)
            const currentDate = dayjs(time)
            let result = false
            if (options.isShowWordLimit) {
              result =
                currentDate.isBefore(startDate) || currentDate.isAfter(endDate)
            }
            return result
          }
        } else {
          const { startTime, endTime, isShowWeeksLimit } = options
          switch (options.type) {
            case 'date':
            case 'datetime':
              if (startTime && options.isShowWordLimit) {
                result.minDate = dayjs.unix(startTime).toDate()
              } else {
                result.minDate = dayjs.unix(0).toDate()
              }
              if (endTime && options.isShowWordLimit) {
                result.maxDate = dayjs.unix(endTime).toDate()
              } else {
                result.maxDate = dayjs().add(20, 'year').toDate()
              }
              break
            case 'dates':
              if (_.isEmpty(options.defaultValue)) {
                result.defaultDate = null
              } else {
                options.defaultValue.map((e) => dayjs.unix(e).toDate())
              }
              if (startTime && options.isShowWordLimit) {
                result.minDate = dayjs.unix(startTime).toDate()
              } else {
                result.minDate = dayjs().subtract(1, 'year').toDate()
              }
              if (endTime && options.isShowWordLimit) {
                result.maxDate = dayjs.unix(endTime).toDate()
              } else {
                result.maxDate = dayjs().add(1, 'year').toDate()
              }
              break
            case 'daterange':
              if (options.defaultValue) {
                result.defaultDate = options.defaultValue.map((e) =>
                  dayjs.unix(e).toDate(),
                )
              } else {
                result.defaultDate = null
              }
              if (startTime && options.isShowWordLimit) {
                result.minDate = dayjs.unix(startTime).toDate()
              } else {
                result.minDate = dayjs().subtract(1, 'year').toDate()
              }
              if (endTime && options.isShowWordLimit) {
                result.maxDate = dayjs.unix(endTime).toDate()
              } else {
                result.maxDate = dayjs().add(1, 'year').toDate()
              }
              break
          }
        }
        break
      case 'cascader':
        result.options = _.get(state, `data[${options.dataKey}].list`, [])
        //@ts-ignore
        result.props = {
          multiple: options.multiple,
          checkStrictly: options.checkStrictly,
        }
        // result.options = options.options
        break
      case 'slider':
        result.step = options.step
        result.min = options.min
        result.max = options.max
        break
      case 'divider':
        result.contentPosition = options.contentPosition
        break
      case 'rate':
        result.allowHalf = options.allowHalf
        if (!isPc) {
          result.count = options.max
        } else {
          result.max = options.max
        }
        break
      case 'html':
        result.type = 'textarea'
        result.rows = 4
        result.action = options.action
        result.maxSize = options.size * 1024 * 1024
        result.config = {
          placeholder: options.placeholder,
        }
        if (!isPc) {
          result.config.toolbar = {
            items: [
              'formattingOptions',
              '|',
              'uploadImage',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'link',
              'undo',
              'redo',
            ],
          }
          result.config.formattingOptions = [
            'fontFamily',
            'fontSize',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'alignment',
            'blockQuote',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'insertTable',
            'removeFormat',
          ]
        }
        break
      case 'uploadfile':
        result.multiple = options.multiple
        result.action = options.action
        // result.size = options.size
        result.accept = options.accept
        result.maxSize = options.size * 1024 * 1024
        if (isPc) {
          result.limit = options.limit
        } else {
          result.maxCount = options.limit
          //@ts-ignore
          result.onOversize = (file) => {
            showToast(t('er.validateMsg.fileSize', { size: options.size }))
          }
        }
        break
      case 'region':
        if (isPc) {
          const region = new Region(areaList, {
            isFilter: false,
            selectType: options.selectType,
          })
          result.options = region.getAll()
          //@ts-ignore
          result.props = {
            emitPath: false,
          }
          result.filterable = options.filterable
        } else {
          result.areaList = areaList
          result.columnsNum = options.selectType
        }
        break
    }
    specialHandling && specialHandling(node.type, result)
    return result
  }

  isShowTitle() {
    return false
  }
  onFocus(config) {
    let oldValue = this.getBindValue()
    this.oldValue = oldValue
  }
  onBlur(value?: any) {
    let nValue = this.getBindValue()
    let oldValue = this.oldValue //
    let config = this.config
    let _config = {
      value: nValue,
      oldValue: oldValue,
      item: this,
      form: this.form,
    }
    //@ts-ignore
    let _onBlur = config.onBlur //
    if (typeof _onBlur == 'function') {
      _onBlur(_config) //
    } //
  } //
  async designForm() {
    let formConfig = this.getFormConfig() //
    let _config = _.cloneDeep(formConfig) //
    let system = this.getSystem() //
    let tName = this.form.tableName
    let _f = new Form(_config) //
    _f.tableName = tName
    //@ts-ignore
    let dTableName = this.form.dTableName || this.form.tableName
    _f.dTableName = dTableName //
    let oldLayoutData = this.getRef('fieldCom').getLayoutData()
    _f.setLayoutData(oldLayoutData) //
    _f.setCurrentDesign(true) //
    let createFn = () => {
      return {
        component: erFormEditor,
        props: {
          formIns: _f,
        },
      }
    }
    system.openDialog({
      height: 600,
      width: 1200,
      createFn,
      confirmFn: (dialog: Dialog) => {
        let inCom: Form = dialog.getRef('innerCom')
        let layoutData = inCom.getLayoutData()
        let options = this.getOptions()
        options['layoutData'] = layoutData //
        let fieldCom: Form = this.getRef('fieldCom')
        fieldCom.setLayoutData(layoutData) //
      },
    })
  }
  getFormConfig() {
    let options = this.getOptions()
    let items = options?.items || [] //
    let itemSpan = this.getItemSpan() //
    let layoutData = options.layoutData //
    return {
      items: items,
      layoutData, //
      itemSpan: itemSpan, //
    }
  }
  getPageButtons() {
    let options = this.getOptions()
    let items = options.items || [] //
    return items
  }
  getPageButtonsProps() {
    let options = this.getOptions()
    let items = this.getPageButtons()
    return {
      items,
      buttonWidth: 50, //
    }
  }
  getOptions(): any {
    let config = this.config
    let options = config?.options || {}
    return options
  }
  getItemSpan() {
    let config = this.getOptions()
    let span = config.itemSpan //
    if (span == null) {
      span = 6 //
    }
    let type = this.getType()
    if (type == 'stable') {
      let showTable = this.getShowTable()
      if (showTable == true) {
        span = 24 //
      }
    }
    return span //
  }
  getTableConfig() {
    let options = this.getOptions()
    let tableConfig = options.tableConfig || {}
    let _config = {
      ...tableConfig,
      showRowSeriesNumber: false,
      showCheckboxColumn: false,
      showFooter: false,
      showCalculate: false,
    } //
    return _config
  }
  openTableDialog() {
    let options = this.getOptions()
    let tableConfig = options.tableConfig || {} //
    let sys = this.getSystem()
    let value = this.getBindValue() //
    if (typeof value == 'string') {
      try {
        let _value1 = JSON.parse(value) //
        if (Array.isArray(_value1)) {
          value = _value1 //
        }
      } catch (error) {}
    }
    if (!Array.isArray(value)) {
      value = [] //
    }
    let table = new Table(tableConfig) //
    table.setTableState('edit') //
    table.setData(value) //
    let createFn = () => {
      //
      return {
        component: tableCom,
        props: {
          tableIns: table, //
        },
      }
    } //
    sys.openDialog({
      height: 600,
      width: 1200,
      createFn, //
      confirmFn: (dialog: Dialog) => {
        let data = table.getData()
        this.updateBindData({ value: data }) //
      },
    })
  }
  getCodeConfig() {
    let options = this.getOptions()
    let codeConfig = options.codeConfig || {} //
    return codeConfig //
  }
  openCodeDialog() {
    let codeConfig = this.getCodeConfig() //
    let sys = this.getSystem() //
    let value = this.getBindValue() ////
    let createFn = () => {
      //
      return {
        component: codeEditorCom,
        props: {
          ...codeConfig,
          modelValue: value,
        },
      }
    } //
    sys.openDialog({
      height: 600,
      width: 1200,
      createFn, //
      confirmFn: (dialog: Dialog) => {
        let com: CodeEditor = dialog.getRef('innerCom')
        let bindValue = com.getBindValue() //
        this.updateBindData({ value: bindValue }) ////
      },
    })
  }
  getShowTable() {
    let options = this.getOptions()
    let showTable = options.showTable //
    return showTable
  }
  getTableName() {
    let tableName = this.tableName
    return tableName
  }
  getdBindData() {
    return {}
  }
  createFormRules() {
    let required = this.config.required
    let rArr = [] //
    if (required == true) {
      let _fn = (config) => {
        let { itemValue, rule, rules, data, field } = config
        if (itemValue == null || itemValue === '') {
          //
          return Promise.reject(new Error('必填')) //
        }
        return true
      }
      let obj1 = {
        validator: _fn,
        // required: true,
      }
      rArr.push(obj1) //
    }
    let f = this.getField()
    let obj = {
      [f]: rArr, //
    }
    return obj //
  }
  openMainMenu(e) {
    let f = this.getField()
    let tableName = this.getTableName() //
    let sys = this.getSystem()
    let d = sys.getTargetDesign(tableName)
    if (d == null) {
      return
    }
    d.currentDField = f
    d.openContextMenu(e) //
  }
  async executeEvent(config) {
    let eventManager = this.eventManager //
    let event: string = config.event
    if (event == null) {
    } //
    let eArr = eventManager[event]
    if (eArr == null) {
      return
    }
    if (!Array.isArray(eArr)) {
      return
    }
    for (let ev of eArr) {
      //
    }
  }
}
