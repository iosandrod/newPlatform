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
    clearable: item.getClearable(), //
  }
}
export const inputType = (item: FormItem) => {
  let obj = defaultType(item)
  let password = item.config.password
  if (password) {
    obj.type = 'password' //
  }
  return obj //
}
export const selectType = (item: FormItem) => {
  let obj = defaultType(item)
  let options = item.getSelectOptions()
  obj.options = options
  obj.onChange = (config) => {
    let value = config.value
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
export const itemTypeMap = {
  input: inputType,
  string: inputType,
  default: defaultType,
  select: selectType,
  stable: stableType,
}
