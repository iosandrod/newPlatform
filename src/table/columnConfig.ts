export const colFormConfig = {
    fields: [
        {
            type: 'field',
            label: '字段名',
            key: 'name',
            required: true,
        },
    ]
}

export const generateConfig = {
    itemSpan: 12,
    fields: [
        {
            field: "title",
            type: "string",
            label: "标题",
        },
        {
            field: "field",
            type: "select",
            label: "字段名",
            //允许动态添加
            enableAdd: true,
            //使用表格字段名
            options: (config) => {
                return []
            },
        }
    ]
}
export const selectEditConfig = {
    ...generateConfig,
    fields: [
        ...generateConfig.fields,
        {
            field: "options",
            type: "stable",
            label: "下拉选项",
        },
        {
            field: "bindOption",
            type: 'string',
            label: "绑定字段"
        },
    ]
}

export const inputEditConfig = {
    ...generateConfig,
    fields: [
        ...generateConfig.fields
    ]
}

export const dateEditConfig = {
    ...generateConfig,
    field: [
        ...generateConfig.fields
    ]
}