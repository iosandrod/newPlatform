import { Base } from '@ER/base'
import { Column } from './column'
import XeColCom from './xeColCom'
import { VxeColumnProps } from 'vxe-table'
import XeColHeaderCom from './xeColHeaderCom'
import { XeTable } from './xetable'
import { h } from 'vue'
import { stringToFunction } from '@ER/utils'
import CodeEditor from '@/codeEditor/codeEditor'
import { Dialog } from '@/dialog/dialog'

export class XeColumn extends Column {
  templateTitle = '' //模板标题
  isEditTitle = false //是否可以编辑标题
  //@ts-ignore
  columns: XeColumn[]
  constructor(config: any, table) {
    super(config, table)
    this.initColumnSelect()
  }
  addColumn(config: any) {
    let table = this.getTable()
    let columns = this.columns
    let column = new XeColumn(config, table)
    columns.push(column)
  }
  getSlots() {
    return {
      default: (config) => {
        return <XeColCom row={config.row} config={config}></XeColCom>
      },
      header: (config) => {
        let com = h(XeColHeaderCom, { config, checked: config.checked })

        return com //
        // return <div>header</div>
      },
      checkbox: (config) => {
        return (
          <XeColCom
            row={config.row}
            type="checkbox"
            checked={config.checked}
            config={config}
          ></XeColCom>
        )
      },
    }
  }

  getColumnProps() {
    let config = this.config
    const slots = this.getSlots()
    let isTree = this.getIsTree()

    let obj: VxeColumnProps & { order: number } = {
      ...config,
      width: this.getColumnWidth(),
      slots, //
      params: this,
      order: this.getOrder(),
      align: 'center',
      treeNode: isTree, //
    } //
    return obj
  }
  //@ts-ignore
  getTable(): XeTable {
    let s = super.getTable() as any
    return s //
  }
  getPlaceholder() {
    return this.config.placeholder
  }
  //@ts-ignore
  async updateBindValue(config: any) {
    //
    let value = config.value //值
    let row = config.row //行
    let field = config.field || this.getField()
    let table = this.getTable()
    if (config.validate === false) {
      row[field] = value //
      return true
    }
    let _res = await this.validateValue({ ...config, table })
    if (_res == true) {
      let oldv = row[field]
      if (oldv == value) {
        return true
      }
      row[field] = value //
      if (row['_rowState'] == 'unChange') {
        row['_rowState'] = 'change' //
      }
      return true
    } else {
      let table = this.getTable() //
      //@ts-ignore
      table.validateMap[row._index] = [_res] //
    }
  }
  getDisabled() {}
  //@ts-ignore
  getBindValue(config) {
    let f = this.getField()
    let row = config?.row
    if (row == null) {
      throw new Error('row is null') //
    }
    return row[f] //
  }
  openCodeDialog(config) {
    this.getTable().currentEditCol = this //
    let tableName = this.getTableName()
    this.disableHideCell = true
    let codeConfig = this.getCodeConfig() //
    let sys = this.getSystem() //
    let value = this.getBindValue(config)
    let _config = {
      ...config,
      tableName,
      modelValue: value,
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
    }
    this.disableHideCell = true
    sys.openCodeDialog(_config) //
  }
  onBlur(config) {}
  getClearable() {
    return true
  }
  getOptions() {
    let config = this.config
    return config
  } //
  getMultiple() {
    return false //
  }
  getFlatColumns() {
    let columns = this.columns
    if (columns.length > 0) {
      return columns
        .map((col) => {
          return col.getFlatColumns()
        })
        .flat()
    }
    return [this] //
  }
  getBindShowValue(config) {
    return ''
  }
  getCheckBindValue(config) {
    let row = config.row
    let f = this.getField()
    let v = row[f]
    if (Boolean(v)) {
      return 1
    }
    return 0 //
  }
  getAlign() {
    let a = this.config.align
    if (['left', 'center', 'right'].includes(a)) {
      return a
    }
    return 'center' //
  }
  getCellStyle(config) {
    let isTree = this.getIsTree()
    let style: any = {
      height: '100%',
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      position: 'relative',
    }
    if (isTree == true) {
      style.justifyContent = 'flex-start'
    } else {
      let align = this.getAlign()
      if (align == 'left') {
        style.justifyContent = 'flex-start'
      } else if (align == 'center') {
        style.justifyContent = 'center'
      } else if (align == 'right') {
        style.justifyContent = 'flex-end'
      }
    } //
    return style
  }
  setShowDragIcon(show: boolean) {
    this.showDragIcon = show //
  }
  getFormat() {
    let config = this.config
    let fieldFormat = config.fieldFormat
    if (typeof fieldFormat !== 'function') {
      if (typeof fieldFormat == 'string') {
        fieldFormat = stringToFunction(fieldFormat + '')
      }
      if (typeof fieldFormat !== 'function') {
        fieldFormat = (config) => {
          let _this: XeColumn = config.column || config.col //
          if (_this == null) {
          }
          let type = _this.getEditType()
          let row = config.row
          if (row == null) {
            return '' //
          }
          let field = config.field
          let value = row[field] //
          let label = null
          if (type == 'select') {
            let options = _this.getSelectOptions()
            let value = config.row[field]
            let _label = options.find((item) => item.value == value)?.label
            label = _label
          }
          return label || value //
        }
      }
    }
    return fieldFormat
  }
  getShowDragIcon() {
    return this.showDragIcon
  }
  setTemplateTitle(config) {
    let v = config.value
    this.templateTitle = v
  }
  setTitle(title: string) {
    if (title == '') {
      return
    } //
    let config = this.config
    config.title = title //
    let t = this.getTable() //
    t.onHeaderTitleChange({ column: this.config }) //
  }
  getDropdownModelValue(row) {
    let _index = row._index
    let curEditIndex = this.currentDropdownIndex //
    if (_index == curEditIndex) {
      return true
    } //
    return false
  } //
  getCurrentEditRow() {
    let currentEditIndex = this.currentEditIndex
    let table = this.getTable()
    let tableMap = table.dataMap
    let row = tableMap[currentEditIndex]
    return row
  }
  confirmTinyTableRow(row) {
    let bConfig = this.getBaseInfoConfig() //
    let bindColumns = bConfig?.bindColumns || []
    if (Array.isArray(bindColumns) && bindColumns.length > 0) {
      if (bindColumns.length == 1) {
        bindColumns = bindColumns[0]
        let field = bindColumns.targetKey
        let value = row[field]
        let myF = this.getField()
        this.cacheValueObj = {
          //
          [myF]: value,
        }
        this.cacheValue = value //
      } else {
        let _obj = {}
        for (const col of bindColumns) {
          let field = col.targetKey
          let myField = col.key //
          let value = row[field]
          _obj[myField] = value
        }
        this.cacheValueObj = _obj
        let f = this.getField()
        let _v = _obj[f]
        this.cacheValue = _v //
      }
      this.isChangeValue = true //
    }
    let curEditRow = this.getCurrentEditRow()
    Object.entries(this.cacheValueObj).forEach(([key, value]) => {
      let _row = curEditRow
      if (key == this.getField()) {
        this.updateBindValue({
          value: value, //
          row: curEditRow, //
        })
      } else {
        _row[key] = value //
      }
    })
    this.closeBaseInfoTable() //
  }
  closeBaseInfoTable() {
    this.currentDropdownIndex = null //
  }
}
