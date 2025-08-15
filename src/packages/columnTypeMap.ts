import { XeColumn } from '@/table/xecolumn'
import { FormItem } from './formitem'
import { number } from './utils/equal'
export const defaultType = (item: XeColumn, row): any => {
  return {
    placeholder: item.getPlaceholder(),
    modelValue: item.getBindValue({ row }), //
    onInput: (val) => {
      //   debugger //
      let _val = val.value
      item.updateBindValue({ value: _val, row })
    },
    onBlur: () => {
      item.onBlur({ value: item.getBindValue({ row: row }), row: row })
    },
    onFocus: (config) => {
      item.onFocus({ ...config, row })
    },
    disabled: item.getDisabled(), //
    clearable: item.getClearable(), //
    onOpenPanel: () => {
      // item.disableHideCell = true
      item.disableHideCell = true //
    },
    onHiddenPanel: () => {
      item.disableHideCell = false //
    },
  }
} //
export const inputType = (item: XeColumn, row) => {
  let obj = defaultType(item, row)
  let password = item.getOptions()?.password
  if (password) {
    obj.type = 'password' //
  } //
  return obj //
}
export const selectType = (item: XeColumn, row) => {
  let obj = defaultType(item, row)
  let options = item.getSelectOptions()
  obj.options = options
  obj.multiple = item.getMultiple() //
  obj.onInput = (config) => {} //
  obj.onChange = (config) => {
    let value = config.value
    if (Array.isArray(value)) {
      let _value = value.filter((item) => {
        return item != null && item != '' //
      })
      value = _value //
    }
    item.updateBindValue({ value, row })
  }
  return obj //
}

export const stableType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {}
  obj.onInput = (config) => {
    console.log(config, 'testConfig') //
  } //
  obj.readonly = true //
  obj.clearable = false //
  obj.modelValue = item.getBindShowValue({ row })
  return obj
}
export const codeType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {}
  obj.onInput = (config) => {} //
  obj.readonly = true //
  obj.clearable = false //
  // obj.modelValue = item.getBindShowValue()
  return obj
}
export const booleanType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {
    let value = config.value
    item.updateBindValue({ value, row }) //
  }
  obj.onInput = (config) => {} //
  obj.modelValue = item.getCheckBindValue({ row })
  obj.readonly = true //
  obj.clearable = false
  obj.disabled = item.getDisabled() //
  return obj
}
export const sformType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {}
  obj.readonly = true //
  obj.clearable = false //
  obj.modelValue = 'object'
  return obj
}
export const baseinfoType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {}
  obj.clearable = true
  obj.onInput = (config) => {
    let value = config.value
    item.updateBindValue({ value, row }) //
    item.getTinyTableSearchData({
      value: value,
    })
  }
  obj.isBaseinfo = true
  obj.onVisibleChange = (config) => {
    let visible = config.visible
    item.disableHideCell = visible //
    if (visible == false) {
      item.currentDropdownIndex = null
    } //
  }
  obj.onFocus = (config) => {
    item.onFocus({ ...config, row }) //
    item.openBaseInfoTable({ ...config, row }) //
  }
  obj.onConfirmTinyTable = (config) => {
    item.confirmTinyTableRow(config.row)
  }
  obj.baseinfoConfig = item._getBaseinfoConfig() //
  return obj
}
export const colorType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {
    let value = config.value
    item.updateBindValue({ value, row }) //
  }
  obj.clearable = true
  obj.onInput = (config) => {} //
  return obj
}
export const imageType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {
    let value = config.value
    item.updateBindValue({ value, row }) //
  }
  obj.clearable = true
  //   obj.modelValue = item.getImageBindValue()
  obj.onInput = (config) => {} //
  return obj
}
export const datetimeType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {
    let value = config.value
    item.updateBindValue({ value, row }) //
  }

  obj.type = 'datetime' //
  obj.clearable = true
  return obj
}
export const timeType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {
    let value = config.value
    item.updateBindValue({ value, row }) //
  }
  obj.clearable = true
  obj.type = 'time'
  obj.onInput = (config) => {} //
  return obj
}
export const dateType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {
    let value = config.value
    item.updateBindValue({ value, row }) //
  }
  obj.clearable = true
  obj.onInput = (config) => {} //
  obj.type = 'date'
  return obj
} //
export const numberType = (item: XeColumn, row) => {
  let obj = defaultType(item, row) //
  obj.onChange = (config) => {
    let value = config.value
    item.updateBindValue({ value, row }) //
  }
  obj.clearable = true
  obj.onInput = (config) => {} //
  return obj //
}
export const columnTypeMap = {
  input: inputType,
  string: inputType,
  default: defaultType,
  select: selectType,
  number: numberType,
  stable: stableType,
  code: codeType,
  boolean: booleanType, //
  sform: sformType, //
  baseinfo: baseinfoType,
  color: colorType,
  images: imageType,
  datetime: datetimeType,
  date: dateType,
  time: timeType,
}
export const columnTypeKeys = Object.keys(columnTypeMap)
