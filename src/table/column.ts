import { Base } from '@/base/base'
import { Table } from './table'
import { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable'
import * as VTable from '@visactor/vtable'
import {
  h,
  isProxy,
  isReactive,
  reactive,
  shallowRef,
  watch,
  watchEffect,
} from 'vue'
import { InputEditor } from '@/table/editor/string' //
import {
  CheckBox,
  createGroup,
  createText,
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
let cellType = ['text', 'link', 'image', 'video', 'checkbox']
export class Column extends Base {
  tableState = 'edit' //
  templateCalValue = ''
  canHiddenEditor = false
  effectPool = shallowRef({})
  isChangeValue = false
  table: Table
  cacheValue?: any
  config: any
  columns: Column[] = []
  constructor(config: any, table?: any) {
    super()
    this.table = table
    this.config = config
    this.init()
  } //
  getSelectOptions() {
    let options = this.config.options || []
    return options //
  }
  setHidden(bool) {} //
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
    // debugger //
    if (type == 'select') {
      let isAniVisible = input?.getSelectPanelVisible() //
      if (isAniVisible == true) {
        //
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
  addColumn(col: any) {
    let table = this.table
    let columns = this.columns
    let column = new Column(col, table)
    columns.push(column) //
  }
  unmountedAllWatch() {
    let effectPool = this.effectPool
    Object.entries(effectPool).forEach(([key, value]) => {
      value() //
    })
    this.effectPool = shallowRef({}) //
  }
  getFormat() {
    let field = this.getField() //
    let _table = this.table
    let config = this.config
    let fieldFormat = config.fieldFormat
    if (typeof fieldFormat !== 'function') {
      //
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
    } //
    let formatFn = (record, row, col, table) => {
      let value = record[field] //
      if (typeof fieldFormat == 'function') {
        try {
          let _index = record._index
          if (this.effectPool[_index] == null) {
            this.effectPool[`${_index}`] = watch(
              () => {
                value = fieldFormat({
                  row: record,
                  col: this,
                  table: _table,
                  field: field,
                })
                return value //
              },
              () => {
                //
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
      return value
    }
    return formatFn
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
    } //
    //@ts-ignore
    let headerIcon: ColumnIconOption = {
      // type: 'svg',
      type: 'svg',
      svg: `<svg t="1707378931406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" width="200" height="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588" fill="${hIconColor}"></path></svg>`,
      width: 20,
      height: 20,
      marginRight: 6, //
      positionType: VTable.TYPES.IconPosition.right,
      cursor: 'pointer',
      name: 'filter', //

      //@ts-ignore
      visibleTime: enterType, //
    }
    if (this.columns.length > 0) {
      headerIcon = undefined //
    }
    if (this.table.config.showColumnFilterTable == false) {
      headerIcon = undefined //
    }
    let customLayout = undefined
    if (this.table.showCustomLayout == true) {
      customLayout = (args) => {
        const { table, row, col, rect, value } = args
        let _value: string = value
        // const record = table.getCellOriginRecord(col, row)
        const { height, width } = rect ?? table.getCellRect(col, row)
        const container = createGroup({
          height,
          width,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          overflow: 'hidden',
          alignItems: 'center',
          boundsPadding: [0, 0, 0, 0],
        })
        let locationName = createText({
          text: value, //
          fontSize: 16,
          // fontFamily: 'sans-serif',
          fill: 'black',
          boundsPadding: [0, 0, 0, 0],
          lineDashOffset: 0,
        })
        let globalValue = this.table.globalConfig.value
        if (globalValue.length > 0) {
          let reg = new RegExp(globalValue, 'gi') //
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
                //
                let t2 = createText({
                  text: _value.slice(v.index + v[0].length), //
                  fontSize: 16,
                  // fontFamily: 'sans-serif',
                  fill: 'black',
                  boundsPadding: [0, 0, 0, 0],
                  lineDashOffset: 0,
                })
                arr.push(t2)
              }
              return arr
            })
            .flat() //
          if (_vArr.length > 0) {
            _vArr.forEach((item) => {
              //@ts-ignore
              container.add(item) //
            })
          } else {
            container.add(locationName) //
          }
        } else {
          container.add(locationName) //
        }
        return {
          rootContainer: container,
          renderDefault: false,
        }
      }
    }
    let obj: ColumnDefine = {
      ...config,
      disableColumnResize: true, ////
      field: this.getField(),
      width: this.getColumnWidth(),
      showSort: true,
      cellType: this.getType(),
      sort: () => {
        return 0
      },
      /*
       */
      fieldFormat: _this.getFormat(),
      headerIcon: headerIcon, //
      style: {
        borderColor: (config) => {
          let _table = config.table
          let record = _table.getRecordByCell(config.col, config.row)
          let color = 'RGB(225, 228, 232)' //
          let _index = record._index
          let validateMap = table.validateMap
          let errStr = validateMap[_index]
          //报错了//
          if (errStr) {
            let allField = errStr.map((row) => row.field)
            if (allField.includes(this.getField())) {
              color = 'red'
            } //
          }
          return color
        },
        borderLineWidth: (config) => {
          let _table = config.table
          let record = _table.getRecordByCell(config.col, config.row)
          let color = 1 //
          let _index = record._index
          let validateMap = table.validateMap
          let errStr = validateMap[_index]
          //报错了//
          if (errStr) {
            let allField = errStr.map((row) => row.field)
            if (allField.includes(this.getField())) {
              color = 3
            } //
          }
          return color
        }, //
        bgColor: (config) => {
          let _table = config.table
          let record = _table.getRecordByCell(config.col, config.row)
          let gValue = table.globalConfig.value
          let value = config.value
          let color = null
          if (record == table.tableData.curRow) {
            color = 'RGB(200, 190, 230)'
          }
          if (gValue.length > 0) {
            let reg = new RegExp(gValue, 'g')
            if (reg.test(value)) {
              color = 'RGB(230, 220, 230)' //
            }
          }
          // let _index = record._index
          // let validateMap = table.validateMap
          // let errStr = validateMap[_index]
          // //报错了//
          // if (errStr) {
          //   let allField = errStr.map((row) => row.field)
          //   if (allField.includes(this.getField())) {
          //     color = 'red'
          //   } //
          // }
          return color
        }, //
      },

      editor: edit, ////
      columns: _columns, //
      customLayout: customLayout, //
    }
    if (isFooter) {
      obj.headerCustomLayout = null
      obj.showSort = false
      obj.disableColumnResize = true //
      obj.headerIcon = null
    }
    return obj //
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
          table.updateFooterColumns()
        },
      )
    }
    return this.templateCalValue
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
    return props //
  }
  getCalculateType() {
    let type = this.config.calculateType
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
    let config = this.config
    let width = config.width
    if (width == null) {
      let table = this.table
      let defaultWidth = table.getDefaultWidth()
      width = defaultWidth
    }
    return width
  }
  async updateBindValue(config) {
    let value = config.value //值
    let row = config.row //行
    let field = this.getField()
    let table = this.table
    let _res = await this.validateValue({ ...config, table })
    if (_res == true) {
      row[field] = value //
    } else {
      let table = this.table //
      //@ts-ignore
      table.validateMap[row._index] = [_res] //
    }
  }
  getBindConfig() {
    let editType = this.getEditType()
    let config = this.config
    return {
      ...config,
      type: editType,
    }
  }
  focusInput() {
    //
    let inputRef = this.getRef('input')
    if (inputRef) {
      inputRef.focus && inputRef.focus() //
    }
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
    if (required) {
      let _fn = (vConfig) => {
        let value = vConfig.value
        if (value == null || value == '') {
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
    //
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
}
