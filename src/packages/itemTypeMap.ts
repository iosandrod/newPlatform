import { FormItem } from "./formitem"
export const defaultType = (item: FormItem): any => {
    return {
        placeholder: item.getPlaceholder(),
        modelValue: item.getBindValue(),
        onInput: (val) => {
            item.updateBindData({ value: val })
        },
        clearable: item.getClearable()//
    }
}
export const inputType = (item: FormItem) => {
    let obj = defaultType(item)
    let password = item.config.password
    if (password) {
        obj.type = 'password'
    }
    return obj//
}
export const itemTypeMap = {
    input: inputType,
    default: defaultType
}

