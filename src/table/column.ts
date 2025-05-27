import { Base } from '@/base/base'
import { Table } from './table'
import { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable'
import * as VTable from '@visactor/vtable'
import {
  h,
  inject,
  isProxy,
  isReactive,
  reactive,
  shallowRef,
  toRaw,
  watch,
  watchEffect,
} from 'vue'
import { InputEditor } from '@/table/editor/string' //
import {
  CheckBox,
  createGroup,
  createImage,
  createText,
  Group,
  Radio,
} from '@visactor/vtable/es/vrender'
const VGroup = VTable.VGroup
const VText = VTable.VText
const VImage = VTable.VImage
const VTag = VTable.VTag
import {
  CheckboxColumnDefine,
  ColumnIconOption,
  ICustomLayout,
  ICustomLayoutObj,
  ICustomRenderElement,
  ICustomRenderObj,
} from '@visactor/vtable/es/ts-types'
import { nextTick } from 'vue' //
import { calObj } from './calculateType'
import { stringToFunction } from '@ER/utils'
import codeEditorCom from '@/codeEditor/codeEditorCom'
import { Dialog } from '@/dialog/dialog'
import CodeEditor from '@/codeEditor/codeEditor'
import { getCheckbox } from './columnFn'
import { SearchPageDesign } from '@ER/searchPageDesign'
import { Input } from '@/input/inputClass'
let cellType = ['text', 'link', 'image', 'video', 'checkbox']
export class Column extends Base {
  templateTableConfig = {
    columns: [],
    data: [],
  }
  cacheValueObj = null
  templateBg: any = null
  isHeaderdown = false
  disableHideCell = false //
  isMousedownRecord = null
  tableState = 'edit' //
  templateCalValue = ''
  canHiddenEditor = false
  effectPool = shallowRef({})
  isChangeValue = false
  table: Table
  cacheValue?: any
  config: any
  layoutWatchMap = {}
  columns: Column[] = []
  constructor(config: any, table?: any) {
    super()
    this.table = table
    this.config = config
    this.init()
  } //
  getSelectOptions() {
    let columnSelect = this.config.columnSelect
    let options = this.config.options || []
    if (columnSelect === true) {
      let tableName = this.getTableName()
      let system = this.getSystem()
      let ops = system.columnSelectOptions[tableName]
      let arr = ops || []
      options = arr //
    }
    return options //
  } //
  setHidden(bool) {
    this.config.hidden = bool //
  } //
  getFormitem() {} //
  createSort() {
    let field = this.getField()
    let sort = null
    let type = this.getColType()
    return {
      field,
      sort,
      type,
    }
  }
  getDisableColumnResize() {
    let config = this.config
    let disableColumnResize = config.disableColumnResize
    if (disableColumnResize == null) {
      let table = this.table
      disableColumnResize = table.getDisableColumnResize()
    }
    return disableColumnResize
  }
  getTableName() {
    let _config = this.config
    let tableName = _config.tableName
    if (tableName == null) {
      tableName = this.table.getTableName()
    }
    return tableName //
  }
  getTitle() {
    let config = this.config
    let title = config.title
    if (title == null || title === '') {
      //
      title = this.getField()
    } //
    return title
  }
  getType() {
    let config = this.config
    let type = config.type
    if (type == null || !cellType.includes(type)) {
      return 'text'
    } //
    return type
  }
  getSubColumns() {
    let columns = this.columns
    return [this, ...columns.map((col) => col.getSubColumns()).flat()] //
  }

  init(): void {
    super.init() //
    this.setColumns()
  }
  getCanHidden() {
    let _this = reactive(this)
    let input = _this.getRef('input')
    let type = this.getEditType()
    if (['date', 'datetime', 'time'].includes(type)) {
      let isAniVisible = input?.getDatePanelVisible() //
      if (isAniVisible == true) {
        //
        return true
      }
    }
    if (type == 'select' && type == 'baseinfo') {
      let isAniVisible = input?.getSelectPanelVisible() //
      if (isAniVisible == true) {
        return true
      }
    }
    return false ////
  }
  hiddenEditor() {
    let table = this.table
    let ins = table.getInstance()
    ins.completeEditCell() //
  }
  setColumns() {
    this.columns.splice(0) //
    const config = this.config
    let _columns = config.columns || [] //
    for (const col of _columns) {
      this.addColumn(col)
    }
  } //
  getHeaderCustomLayout() {
    let hCustomLayout = (args) => {
      let { table, row, col, rect, value } = args
      let _value: string = value
      if (value == null || value === '') {
        value = this.getTitle() //
      }
      let { height, width } = rect ?? table.getCellRect(col, row)
      let container = createGroup({
        height: height,
        stroke: this.getBorderColor(), //
        width: width,
        flexWrap: 'nowrap',
        overflow: 'hidden',
        alignItems: 'center', //
        boundsPadding: [0, 0, 0, 0],
      })
      container.on('dragover', (e) => {
        console.log('is drag') //
      })
      let _g = createGroup({
        width: width,
        height,
        x: 0,
        y: 0,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center', //
      })
      // let required = this.getRequired()
      let tColor = this.getHeaderTextColor() //
      let locationName = createText({
        text: value, //
        fontSize: 14,
        fill: tColor,
        overflow: 'hidden',
        // textureColor: 'blue',
        boundsPadding: [0, 10, 0, 5],
        lineDashOffset: 0,
      })

      _g.add(locationName)
      const g1 = this.createFilter({
        table,
        row,
        col,
        rect,
        value,
        height,
        width,
      })
      let controllerGroup = createGroup({
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        alignItems: 'center',
        x: width - 40,
        y: 1, ////
        height: height - 2, //
        background: '',
      })
      //@ts-ignore
      let sortG = this.createSortableIcon({
        table,
        row,
        col,
        rect,
        value,
        height,
        width,
      })
      container.add(_g) //
      container.add(controllerGroup) //
      controllerGroup.add(sortG)
      controllerGroup.add(g1)
      // container.add(locationName)//

      container.on('mouseenter', () => {
        controllerGroup.attribute.background = 'RGB(204, 224, 255)' //
        //显示filter
        let image = g1._lastChild
        image.attribute.y = height / 2 - image.attribute.height / 2 //
        image.attribute.visible = true
        //显示sortable
        let sortImage = sortG
        let g: Group = sortImage as any
        if (g) {
          // g.attribute.visibleAll = true
          g.visibleAll(true) //
        }
      })
      let _this = this
      container.on('mouseleave', () => {
        controllerGroup.attribute.background = '' //
        let image = g1._lastChild
        let item = _this.table.columnFilterConfig.filterConfig.find(
          (item) => item.field == _this.getField(),
        )
        if (item != null) {
          let indexArr = item.indexArr
          if (indexArr.length > 0) {
            return
          }
          image.attribute.visible = false //
        } else {
          image.attribute.visible = false //
        }
        let g: Group = sortG as any //
        if (g) {
          //@ts-ignore
          let colors = g.children.map(
            //@ts-ignore
            (item) => item.attribute.textureColor as string,
          )
          if (!colors.includes('red')) {
            g.visibleAll(false) //
          }
        }
      })
      return {
        rootContainer: container,
        renderDefault: false,
      }
    }
    return hCustomLayout
  }
  addColumn(col: any) {
    let table = this.table
    let columns = this.columns
    let column = new Column(col, table)
    columns.push(column) //
  }
  onUnmounted() {
    this.unmountedAllWatch()
  }
  unmountedAllWatch() {
    let effectPool = this.effectPool
    Object.entries(effectPool).forEach(([key, value]) => {
      value() //
    })
    this.effectPool = shallowRef({}) //
  }
  getCheckboxCustomLayout() {
    let customLayout = getCheckbox(this)
    return customLayout
  }
  getFormat() {
    let field = this.getField() //
    let _table = this.table
    let config = this.config
    let fieldFormat = config.fieldFormat
    if (typeof fieldFormat !== 'function') {
      if (typeof fieldFormat == 'string') {
        fieldFormat = stringToFunction(fieldFormat + '')
      }
      if (typeof fieldFormat !== 'function') {
        fieldFormat = (config) => {
          let type = this.getEditType()
          let row = config.row
          let field = config.field
          let value = row[field] //
          if (type == 'select') {
            let options = this.getSelectOptions()
            let value = config.row[field]
            let _label = options.find((item) => item.value == value)?.label
            return _label || value //
          } ////
          return value
        }
      }
    } //
    let formatFn = (record, row, col, table) => {
      let value = record[field] //
      if (typeof fieldFormat == 'function') {
        try {
          let _index = record._index
          if (this.effectPool[_index] == null) {
            this.effectPool[`${_index}`] = watch(
              () => {
                let value = '' //
                if (typeof fieldFormat == 'function') {
                  let value1 = fieldFormat({
                    row: record,
                    col: this,
                    table: _table,
                    field: field,
                  })
                  if (value1 != null) {
                    value = value1
                  } //
                } //
                return value //
              },
              (newV) => {
                console.log(newV, '新增了') //
                _table.updateIndexArr.add(_index) //
              },
            )
          } //
          value = fieldFormat({
            row: record,
            col: this,
            table: _table,
            field: field,
          })
        } catch (error) {
          //
        }
      }
      if (value === 0) {
        value = '0' //
      }
      return value
    }
    return formatFn
  }
  getIndexColor(row, record?: any) {
    let color = 'rgb(255,255,255)'
    if (row % 2 == 0) {
      color = 'rgb(255,255,255)'
    } else {
      color = 'rgb(249,250,251)'
    }
    let bgColor = this.getBgColor()
    if (typeof bgColor == 'function') {
      let color1 = bgColor(record) //
      if (color1 != null) {
        color = color1 //
      }
    }
    return color
  }
  getMergeCell() {
    let table = this.table
    let isMergeCell = table.isMergeCell
  }
  getMergeCellColor() {
    let color = 'RGB(236, 241, 245)'
    return color
  }
  getColumnProps(isFooter = false) {
    let table = this.table
    let config = this.config
    let _columns = this.columns.map((col) => {
      if (isFooter == true) {
        return col.getFooterColumnProps()
      } //
      return col.getColumnProps(isFooter) //
    })
    if (_columns.length == 0) {
      _columns = null
    }
    let _this = this
    let edit = null
    let editType = this.getEditType()
    if (editType != null && editType != 'checkbox') {
      //
      edit = new InputEditor(() => this) //
    }
    let hIconColor = '#1890ff'
    let enterType = 'mouseenter_cell'
    let item = _this.table.columnFilterConfig.filterConfig.find(
      (item) => item.field == _this.getField(),
    )
    if (item != null) {
      let indexArr = item.indexArr
      if (indexArr.length > 0) {
        hIconColor = 'red'
        enterType = null
      }
    }
    //@ts-ignore
    let customLayout = undefined
    if (this.table.showCustomLayout == true) {
      customLayout = this.getCustomLayout() //
    }
    //@ts-ignore
    let obj: ColumnDefine = {
      // ...config,
      //@ts-ignore
      order: this.getOrder(),
      disableColumnResize: this.getDisableColumnResize(), ////
      field: this.getField(),
      width: this.getColumnWidth(),
      showSort: true,
      title: this.getTitle(), //
      cellType: this.getType(),
      headerStyle: {
        borderColor: this.getBorderColor(), //
      },
      sort: () => {
        return 0
      },
      /*
       */
      fieldFormat: _this.getFormat(),
      style: {
        borderColor: this.getBorderColor(),
      },
      headerCustomLayout: this.getHeaderCustomLayout(), //
      editor: edit, ////
      // headerEditor: new InputEditor(() => this), //
      columns: _columns, //
      customLayout: customLayout, //
    }
    if (isFooter) {
      obj.headerCustomLayout = null
      obj.showSort = false
      obj.disableColumnResize = true //
      obj.headerIcon = null
    }
    //@ts-ignore
    obj.isFrozen = this.getIsRightFrozen()
    //@ts-ignore
    obj.isLeftFrozen = this.getIsLeftFrozen()
    let _t = this.getIsTree()
    obj.tree = _t //
    return obj //
  }
  getIsChecked(r) {
    let f = this.getField()
    let v = r[f]
    if (v === '1') {
      v = true
    }
    if (v === '0') {
      v = false //
    }
    v = Boolean(v)
    return v
  }
  getIsTree() {
    let _t = false
    let isTree = this.table.getIsTree()
    let tree = this.config.tree
    if (isTree == true && tree == true) {
      _t = true //
    }
    return _t
  }
  getCalculateValue() {
    let _this = this
    let table = this.table //
    let field = this.getField()
    if (this.effectPool[`${this.id}_cal`] == null) {
      let _data = table.templateProps.data //
      let calType = this.getCalculateType() //
      let v1 = null
      if (calType == 'sum') {
        let calFn = calObj[calType]
        if (typeof calFn == 'function') {
          let _value = calFn(_data, field)
          v1 = _value
        }
      }
      _this.templateCalValue = v1
      this.effectPool[`${this.id}_cal`] = watch(
        () => {
          let _data = table.templateProps.data //
          let calType = this.getCalculateType() //
          let v1 = null
          if (calType == 'sum') {
            let calFn = calObj[calType]
            if (typeof calFn == 'function') {
              let _value = calFn(_data, field)
              v1 = _value
            }
          }
          return v1 //
        },
        (v) => {
          _this.templateCalValue = v
          table.updateFooterColumns() //
        },
      )
    }
    return this.templateCalValue
  }
  getButtonColor() {
    return 'RGB(22, 93, 255)'
  }
  getFooterColumnProps() {
    let _this = this
    let props: ColumnDefine = this.getColumnProps(true) //
    let calType = this.getCalculateType() //
    props.title = '' //
    // console.log(calType, 'testCalType')//
    if (calType == 'sum') {
      props.headerCustomLayout = (args) => {
        const { table, row, col, rect } = args
        const { height, width } = rect ?? table.getCellRect(col, row)
        const container = createGroup({
          height,
          width,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }) //

        let calValue = _this.getCalculateValue() //
        let text = createText({
          text: calValue, //
          fontSize: 16,
          fill: 'black',
          fontWeight: 'bold',
          boundsPadding: [0, 0, 0, 0],
          lineDashOffset: 0,
        }) //
        container.add(text)
        return {
          rootContainer: container,
          renderDefault: false,
        }
      }
    }
    let obj: any = props //
    return props //
  }

  getCalculateType() {
    let type = this.config.calculate
    return type
  }
  getIsShow() {
    let config = this.config
    let hidden = config.hidden
    if (hidden == true) {
      return false
    }
    return true
  }
  getField() {
    let config = this.config
    let field = config.field
    if (field == null) {
      field = this.id //
    } //
    return field //
  }
  getColumnWidth() {
    let isFilterTable = this.table.getIsFilterTable()
    let table = this.table
    let config = this.config
    let width = config.width
    if (isFilterTable == true) {
      // let sW = table.getSerialNumberWidth()
      let sW = 0
      let checkWidth = table.getCheckColumnWidth()
      let addW = sW + checkWidth
      let _w = 300 - addW - 10
      if (width == null || width <= addW) {
        width = _w //
      }
    }
    if (width == null) {
      //
      let table = this.table
      let defaultWidth = table.getDefaultWidth()
      width = defaultWidth
    }
    return width
  }
  async updateBindValue(config) {
    //
    let value = config.value //值
    let row = config.row //行
    let field = config.field || this.getField()
    let table = this.table
    if (config.validate === false) {
      row[field] = value //
      return true
    }
    let _res = await this.validateValue({ ...config, table })
    if (_res == true) {
      row[field] = value //
      return true
    } else {
      let table = this.table //
      //@ts-ignore
      table.validateMap[row._index] = [_res] //
    }
  }
  getBindConfig() {
    let editType = this.getEditType() //
    let columnSelect = this.config.columnSelect
    return {
      columnSelect,
      type: editType, //
      tableName: this.getTableName(),
    }
  }
  getOrder() {
    let config = this.config
    let order = config.order
    if (order === null || order === undefined) {
      //
      return 0
    }
    return order //
  }
  async focusInput() {
    let inputRef = this.getRef('input')
    if (inputRef) {
      inputRef.focus && inputRef.focus()
    } //
    if (this.getIsBaseInfo()) {
      this.openBaseInfoTable()
    }
  }
  getIsBaseInfo() {
    let type = this.getEditType() //
    return type == 'baseinfo'
  }
  getEditType() {
    let config = this.config
    let editType = config.editType
    if (editType == null) {
      return
    }
    return editType //
  }
  getColType() {
    let config = this.config
    let type = config.type
    if (type == null) {
      type = 'string'
    } //
    return type
  }
  getIsEditField() {
    let table = this.table
    let isEdit = table.getIsEditTable()
    if (isEdit == false) {
      return false //
    }
    let editType = this.getEditType()
    if (editType) {
      return true
    }
    return false
  }
  getValidator() {
    let config = this.config
    let required = config.required
    let _arr = []
    if (required == true) {
      let _fn = (vConfig) => {
        // let f=this.getField()
        // let row=vConfig.row
        // let _d=row[f]
        let value = vConfig.value //
        if (value == null || value === '') {
          return '此项为必填项' //
        }
        return true
      }
      _arr.push(_fn)
    }
    let validator = config.validator
    if (typeof validator == 'function') {
      _arr.push(validator)
    }
    if (typeof validator == 'string') {
      let _fn1 = stringToFunction(validator)
      if (typeof _fn1 == 'function') {
        _arr.push(_fn1)
      }
    }
    return _arr //
  }
  async validateValue(vConfig?: any) {
    let editType = this.getEditType() //
    if (editType) {
      let validator = this.getValidator() //
      let _res = null
      if (validator) {
        for (const fn of validator) {
          try {
            let _res1 = await fn(vConfig)
            if (typeof _res1 == 'boolean' && _res1 == false) {
              _res = {
                message: '字段校验失败',
                field: this.getField(),
              }
              break
            }
            if (typeof _res1 == 'string') {
              _res = {
                message: _res1,
                field: this.getField(),
                row: vConfig?.row,
              }
              break
            }
          } catch (error) {
            _res = {
              message: error?.message || error, //
              field: this.getField(),
            }
          }
        }
        if (_res == null) {
          return true
        } else {
          return _res //
        }
      }
    }
    return true
  }
  createSortableIcon(
    config: {
      table?: any
      row?: number
      col?: number
      rect?: any
      value?: any
      height?: any
      width?: any
    } = {},
  ) {
    let group = createGroup({
      height: config.height,
      width: 20,
      display: 'flex',
      flexDirection: 'column',
      visibleAll: true,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    })
    let topColor = 'black'
    let bottomColor = 'black' //
    let createTopImageSvg = (topColor = 'black', bottomColor = 'red') => {
      return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
         <!-- 上箭头 -->
         <g transform="translate(0, 6)">
         <path d="M8 4L5 7H11L8 4Z" fill="${topColor}"/>
         </g>
         <!-- 下箭头 -->
       </svg>
       `
    }
    let createBottomImageSvg = (topColor = 'black', bottomColor = 'red') => {
      return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, -6)">
      <path d="M8 12L5 9H11L8 12Z" fill="${bottomColor}"/>
      </g>   
      </svg>
       `
    }
    let sortCache = this.table.sortCache
    let v = sortCache.find((s) => s.field == this.getField())
    let s = Boolean(v)
    let order = v?.order
    if (order == 'asc') {
      topColor = 'red'
    } else if (order == 'desc') {
      bottomColor = 'red'
    }
    let topImage = createImage({
      cursor: 'pointer', ////
      height: config.height / 2,
      textureColor: topColor,
      visible: s,
      width: 20,
      image: createTopImageSvg(topColor, bottomColor), //
    })
    let bottomImage = createImage({
      cursor: 'pointer', //
      height: config.height / 2, //
      textureColor: bottomColor,
      width: 20,
      visible: s,
      image: createBottomImageSvg(topColor, bottomColor), //
    })
    topImage.on('click', (config: any) => {
      let field = this.getField()
      this.table.headerSortClick({
        field,
        order: 'asc',
        type: this.getColType(), //
      })
    })
    bottomImage.on('click', () => {
      let field = this.getField()
      this.table.headerSortClick({
        field,
        order: 'desc',
        type: this.getColType(),
      })
    })
    group.add(topImage)
    group.add(bottomImage) //
    return group //
  }
  getExpandIcon(status = false) {
    let t = null
    if (status) {
      //
      t = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="4" fill="#007AFF" />
  <path d="M12 16L6 10H18L12 16Z" fill="#FFFFFF" />
</svg>`
    } else {
      t = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="4" fill="#007AFF" />
  <path d="M9 6L15 12L9 18V6Z" fill="#FFFFFF" />
</svg>
`
    }
    return t
  }
  createFilter(config: any) {
    let height = config.height
    let hIconColor = '#1890ff' //
    let _this = this
    let item = _this.table.columnFilterConfig.filterConfig.find(
      (item) => item.field == _this.getField(),
    )
    if (item != null) {
      let indexArr = item.indexArr
      if (indexArr.length > 0) {
        hIconColor = 'red'
      }
    }
    const image = createImage({
      image: `<svg t="1707378931406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" width="200" height="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588" fill="${hIconColor}"></path></svg>`,
      width: 16,
      height: 16, //
      textureColor: hIconColor,
      cursor: 'pointer',
      visible: hIconColor == 'red' ? true : false, //
    })
    const g1 = createGroup({
      height: height,
      width: 25, //
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      cursor: 'pointer',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      boundsPadding: [0, 0, 0, 0],
    })
    g1.on('click', (config) => {
      this.table.openColumnFilter(config)
    }) //三角形
    g1.add(image)
    return g1
  }
  getHoverColor() {
    return 'RGB(204, 224, 255)'
  }
  getBorderColor() {
    return 'rgb(229,231,235)' //
  }
  getCurrentRowColor(_bg?: string) {
    let bg = _bg || 'rgb(220,232,240)'
    return bg
  }
  getCustomLayout() {
    //
    let editType = this.getEditType()
    if (editType == 'boolean' && this.table.tableState == 'edit') {
      let _layout = this.getCheckboxCustomLayout()
      return _layout //
    }
    let customLayout = (args) => {
      let { table, row, col, rect, value } = args
      let t1: VTable.ListTable = table

      let _value: string = value
      let record = table.getCellOriginRecord(col, row)
      let bg = this.getIndexColor(row, record) //
      if (toRaw(record) == toRaw(this.table.tableData.curRow)) {
        bg = this.getCurrentRowColor()
      }
      const { height, width } = rect ?? table.getCellRect(col, row)
      let _height = height
      let _length1 = t1.records.length
      if (_length1 == row) {
        _height = _height - 1 //
      }
      let _width = width
      let colCount = t1.colCount
      if (colCount == col + 1) {
        _width = _width - 1
      }
      let lf = this.table.leftFrozen
      if (lf && this.getIsLeftFrozen()) {
        let field = this.getField()
        if (lf == field) {
          _width = _width - 1 //
        }
      }
      let container = createGroup({
        height: _height,
        width: _width,
        // display: 'flex',
        // flexDirection: 'row',
        flexWrap: 'nowrap',
        background: bg, //
        overflow: 'hidden',
        lineWidth: 1,
        stroke: this.getBorderColor(), //
        alignItems: 'center',
        boundsPadding: [0, 0, 0, 0], //
      })
      container.on('mouseenter', () => {
        let oldColor = container.attribute.background
        container._oldColor = oldColor
        container.setAttribute('background', this.getHoverColor()) ///
      })
      container.on('mouseout', () => {
        let color = container._oldColor
        if (record == this.table.tableData.curRow) {
          color = this.getCurrentRowColor() //
        } else {
          if ((color = this.getCurrentRowColor())) {
            color = this.getIndexColor(row, record)
          }
        } //
        container.setAttribute('background', color)
      })
      if (this.getField() == 'pid') {
        // console.log(value, 'testValue') //
      }
      let _bounds = [0, 0, 0, 20]
      let locationName = createText({
        text: `${value}`, //
        fontSize: 16,
        x: 0,
        y: 0,
        // fontFamily: 'sans-serif',
        fill: 'black',
        boundsPadding: _bounds, //
        lineDashOffset: 0,
      })
      let _g = createGroup({
        width: width,
        height,
        x: 0,
        y: 0,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        alignItems: 'center', //
      })
      if (this.getIsTree() == true) {
        // _g.attribute.x = width - 60
        let level = record._level
        if (level > 0) {
          let num = level * 20
          _g.attribute.x = num //
        }
      }
      let globalValue = this.table.globalConfig.value
      if (globalValue.length > 0) {
        let container = _g
        let reg = new RegExp(globalValue, 'gi') //
        _value = `${value}` //
        let vArr = _value.matchAll(reg)
        let _vArr = [...vArr]
        _vArr = _vArr
          .map((v, i) => {
            let arr = []
            let t = createText({
              text: v[0], //
              fontSize: 16,
              fill: 'red',
              boundsPadding: [0, 0, 0, 0],
              lineDashOffset: 0,
            })
            if (i == 0 && v.index > 0) {
              //
              let t1 = createText({
                text: _value.slice(0, v.index), //
                fontSize: 16,
                // fontFamily: 'sans-serif',
                fill: 'black',
                boundsPadding: [0, 0, 0, 0],
                lineDashOffset: 0,
              })
              arr.push(t1)
            }
            arr.push(t)
            if (
              i == _vArr.length - 1 &&
              v.index + v[0].length < _value.length
            ) {
              let t2 = createText({
                text: _value.slice(v.index + v[0].length), //
                fontSize: 14,
                // fontFamily: 'sans-serif',
                fill: 'black',
                boundsPadding: [0, 0, 0, 0],
                lineDashOffset: 0,
              })
              arr.push(t2)
            }
            return arr
          })
          .flat()
        if (_vArr.length > 0) {
          _vArr.forEach((item) => {
            //@ts-ignore
            container.add(item) //
          })
        } else {
          container.add(locationName) //
        }
      } else {
        let container = _g
        container.add(locationName)
      }
      container.add(_g) //
      container.on('mousedown', (args) => {
        if (this.isMousedownRecord != null) {
          this.table.emit('dblclick_cell', { originalData: record }) ////
        }
        this.isMousedownRecord = record
        setTimeout(() => {
          this.isMousedownRecord = null
        }, 130)
      })
      let _index = record['_index'] ////
      let _table = this.table //
      let scrollConfig = _table.getInstance().getBodyVisibleRowRange() ////
      let rowStart = scrollConfig.rowStart
      let rowEnd = scrollConfig.rowEnd
      let _row = row
      container['currentRowIndex'] = row //
      let _this = this
      let isTree = this.getIsTree()
      let treeIcon = null
      if (isTree == true && record?.['children']?.length > 0) {
        container.removeChild(_g)
        let _g1 = createGroup({
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          height: height,
          width: width,
          overflow: 'hidden',
          cursor: 'pointer',
          alignItems: 'center',
          boundsPadding: [0, 0, 0, 0],
        })
        //
        let _level = record['_level'] || 0
        // let t = `\u27A4`
        let t = null
        // console.log(record['_expanded'], 'record')
        t = this.getExpandIcon(record['_expanded'])

        let _g2 = createGroup({
          width: 10,
          height: height / 2,
          x: 0,
          y: 0,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          overflow: 'hidden',
          alignItems: 'center',
        })
        let icon = createImage({
          image: t,
          cursor: 'pointer', //
          height: height / 2,
          overflow: 'hidden',
          fill: 'black',
          boundsPadding: [0, 0, 0, 3 + _level * 16], //
          lineDashOffset: 0,
        }) //
        _bounds[3] = 0 //
        _g2.add(icon)
        _g1.add(_g2) //
        _g1.add(locationName) //
        container.add(_g1) //

        treeIcon = icon
      }
      container['updateCanvas'] = () => {
        // let record = table.getCellOriginRecord(col, row)
        //基本的样式
        let bg = _this.getIndexColor(row, record)
        if (toRaw(record) == toRaw(_this.table.tableData.curRow)) {
          bg = _this.getCurrentRowColor() //
        } //
        container.setAttribute('background', bg)
        let formatFn = _this.getFormat()
        let _value = formatFn(record, row, col, table)
        locationName.setAttribute('text', _value)
        if (treeIcon != null) {
          let _expanded = record['_expanded']
          let t = this.getExpandIcon(_expanded)
          treeIcon.setAttribute('image', t) //
        }
      } //

      let _length = 200 //
      rowStart = rowStart - _length
      if (rowStart < 0) {
        rowStart = 0 //
      }
      rowEnd = rowEnd + _length
      if (_row >= rowStart && _row <= rowEnd) {
        let currentIndexContain = _table.currentIndexContain
        //显示在视图上
        let _arr = currentIndexContain[_index]
        if (_arr == null) {
          currentIndexContain[_index] = {}
          _arr = currentIndexContain[_index] //
        }
        let field = this.getField()
        _arr[field] = container //
      } else {
        let currentIndexContain = _table.currentIndexContain //
        delete currentIndexContain[_index] //
      }
      // let _isTree = this.getIsTree()
      // if (_isTree == true) {
      //   container = null //
      // }
      return {
        rootContainer: container,
        // renderDefault: _isTree, //
        renderDefault: false, //
      }
    }
    return customLayout
  }
  async getDefaultValue(_config?: any) {
    let field = this.getField()
    let config = this.config
    let defaultValue = config.defaultValue
    if (defaultValue == null) {
      return {} //
    }
    let table = this.table
    let design = table?.getMainPageDesign()
    let curRow = design?.getCurRow()
    if (typeof defaultValue == 'function') {
      defaultValue = await defaultValue({
        column: this,
        table: this.table,
        item: this,
        design: design,
        curRow: curRow,
        ..._config,
      }) //
    }
    let defaultValueType = config.defaultValueType
    if (defaultValueType == 'function') {
      let _fn = stringToFunction(defaultValue)
      if (typeof _fn == 'function') {
        try {
          defaultValue = await _fn({
            column: this,
            table: this.table,
            item: this,
          })
        } catch (error) {
          defaultValue = '' //
        }
      }
    } //
    let obj = {
      [field]: defaultValue,
    }
    return obj
  }
  getBgColor() {
    let bgColor = this.templateBg
    if (bgColor != null) {
      return bgColor //is Function
    }
    let bg = this.config.bgColor
    if (typeof bg == 'function') {
      this.templateBg = bg
      return bg
    }
    if (typeof bg == 'string') {
      bg = stringToFunction(bg)
      if (typeof bg == 'function') {
        this.templateBg = bg
      }
    }
    return null //
  }
  getCurrentDesign() {
    return null //
  }
  openCodeDialog(config) {
    let tableName = this.getTableName()
    this.disableHideCell = true
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
          tableName,
        },
      }
    }
    this.disableHideCell = true
    sys.openDialog({
      height: 600,
      width: 1200,
      createFn, //
      confirmFn: (dialog: Dialog) => {
        let com: CodeEditor = dialog.getRef('innerCom')
        let bindValue = com.getBindValue() //
        let updateFn = config?.updateFn
        this.disableHideCell = false
        if (typeof updateFn == 'function') {
          // this.updateBindData({ value: bindValue }) ////
          updateFn({ value: bindValue })
        }
      },
      closeFn: () => {
        this.disableHideCell = false //
      },
    })
  }
  getCodeConfig() {
    return {}
  }
  getBindValue() {
    let cacheValue = this.cacheValue
    return cacheValue //
  }
  updateBindData() {}
  getIsFrozen() {
    let frozen = this.config.frozen
    if (['left', 'right'].includes(frozen)) {
      frozen = true
    }
    return frozen
  }
  getIsLeftFrozen() {
    let frozen = this.config.frozen
    if (frozen == 'left') {
      frozen = true
    } else {
      frozen = false //
    }
    return frozen
  }
  getHidden() {
    let config = this.config
    let hidden = config.hidden
    if (hidden == true) {
      return true
    }
    return false //
  }
  getIsRightFrozen() {
    let frozen = this.config.frozen
    if (frozen == 'right') {
      frozen = true
    } else {
      frozen = false
    }
    return frozen //
  }
  setNoFrozen() {
    let config = this.config //
    config.frozen = null //
  }
  setFrozen(type) {
    let config = this.config
    if (!['left', 'right'].includes(type)) {
      return
    }
    config.frozen = type ////
  }
  setOrder(n: number) {
    //
    let config = this.config
    config.order = n
  }
  //
  getRequired() {
    return this.config.required
  }
  getHeaderTextColor() {
    let required = this.getRequired()
    let color = 'black'
    if (required) {
      color = 'blue' //
    }
    return color
  }
  initColumnSelect() {
    let columnSelect = this.config.columnSelect
    if (columnSelect !== true) {
      return //
    }
    let sys = this.getSystem()
    let tableName = this.getTableName()
    if (tableName == null) {
      return //
    }
    sys.createColumnSelect(tableName)
  }
  getBaseInfoConfig() {
    return this.templateTableConfig
  }
  async openBaseInfoTable() {
    let sys = this.getSystem() //
    let tableName = this.getTableName() //
    let searchEn: SearchPageDesign = await sys.createPageSearchDesign(tableName)
    let columns = searchEn.getTableColumns()
    let _data = await searchEn.getTinyTableData({})
    this.templateTableConfig.columns = columns
    this.templateTableConfig.data = _data
    nextTick(() => {
      this.showDropdown() //
    })
  }
  showDropdown() {
    let input: Input = this.getRef('input')
    if (input == null) {
      return
    }
    input.showDropdown({})
  }
  onFocus(config) {}
  confirmTinyTableRow(row) {
    let bindColumns = this.config.bindColumns //
    if (Array.isArray(bindColumns) && bindColumns.length > 0) {
      if (bindColumns.length == 1) {
        bindColumns = bindColumns[0]
        let field = bindColumns.field
        let value = row[field] //
        this.cacheValue = value //
      } else {
        let _obj = {}
        for (const col of bindColumns) {
          let field = col.field
          let myField = col.myField
          let value = row[field]
          _obj[myField] = value
        }
        this.cacheValueObj = _obj
      }
    }
    this.isChangeValue = true //
    this.closeBaseInfoTable() //
  }
  closeBaseInfoTable() {
    let input: Input = this.getRef('input')
    if (input == null) {
      return
    } //
    input.hiddenDropdown() //
  }
}
