import { FormItem } from './formitem'
export const defaultType = (item: FormItem): any => {
  return {
    placeholder: item.getPlaceholder(),
    modelValue: item.getBindValue(),
    onInput: (val) => {
      item.updateBindData({ value: val })
    },
    onBlur: () => {
      //
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
export const itemTypeMap = {
  input: inputType,
  default: defaultType,
  select: selectType,
}
