import { FormItem } from './formitem'
export const defaultType = (item: FormItem): any => {
  return {
    placeholder: item.getPlaceholder(),
    modelValue: item.getBindValue(),
    onInput: (val) => {
      let _val = val.value
      item.updateBindData({ value: _val }) //
    },
    onBlur: () => {
      item.onBlur(item.getBindValue())
    },
    onFocus: (config) => {
      item.onFocus(config)
    },
    disabled: item.getDisabled(), //
    clearable: item.getClearable(), //
  }
} //
export const inputType = (item: FormItem) => {
  let obj = defaultType(item)
  let password = item.getOptions()?.password
  if (password) {
    obj.type = 'password' //
  }
  let isShowSearchIcon = item.getIsShowSearchIcon()
  if (isShowSearchIcon) {
    obj.type = 'search' //
  }
  if (obj.type == 'search') {
    //
    obj.onSearchClick = (e) => {
      item.onSearchClick(e)
    }
  }
  return obj //
}
export const selectType = (item: FormItem) => {
  let obj = defaultType(item)
  let options = item.getSelectOptions()
  obj.options = options
  obj.multiple = item.getMultiple() //
  obj.onChange = (config) => {
    let value = config.value
    if (Array.isArray(value)) {
      let _value = value.filter((item) => {
        return item != null && item != '' //
      })
      value = _value //
    }
    item.updateBindData({ value }) //
  }
  return obj
}

export const stableType = (item: FormItem) => {
  let obj = defaultType(item) //
  obj.onChange = (config) => {}
  obj.onInput = (config) => {} //
  obj.readonly = true //
  obj.clearable = false //
  obj.modelValue = item.getBindShowValue()
  return obj
}
export const codeType = (item: FormItem) => {
  let obj = defaultType(item) //
  obj.onChange = (config) => {}
  obj.onInput = (config) => {} //
  obj.readonly = true //
  obj.clearable = false //
  obj.modelValue = item.getBindShowValue()
  return obj
}
export const booleanType = (item: FormItem) => {
  let obj = defaultType(item) //
  obj.onChange = (config) => {
    let value = config.value
    item.updateBindData({ value }) //
  }
  obj.onInput = (config) => {} //
  obj.modelValue = item.getCheckBindValue()
  obj.readonly = true //
  obj.clearable = false
  obj.disabled = item.getDisabled() //
  return obj
}
export const sformType = (item: FormItem) => {
  let obj = defaultType(item) //
  obj.onChange = (config) => {}
  obj.readonly = true //
  obj.clearable = false //
  obj.modelValue = 'object'
  return obj
}
export const baseinfoType = (item: FormItem) => {
  let obj = defaultType(item) //
  obj.onChange = (config) => {}
  obj.clearable = true
  obj.onInput = (config) => {
    console.log('baseinfoInput') //
  } //
  return obj
}
export const colorType = (item: FormItem) => {
  let obj = defaultType(item) //
  obj.onChange = (config) => {
    let value = config.value
    item.updateBindData({ value }) //
  }
  obj.clearable = true
  obj.onInput = (config) => {} //
  return obj
}
export const itemTypeMap = {
  input: inputType,
  string: inputType,
  default: defaultType,
  select: selectType,
  stable: stableType,
  code: codeType,
  boolean: booleanType, //
  sform: sformType, //
  baseinfo: baseinfoType,
  color: colorType,
}
