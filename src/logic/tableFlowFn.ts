import { TableFlow } from './tableFlow'

export const getForeignKeyConfigData = (tableFlow: TableFlow) => {
  return []
}
export const getForeignKeyConfigColumns = (tableFlow: TableFlow) => {
  return [
    {
      title: '表名',
      field: 'tableName',
    },
    {
      title: '当前关联',
      field: 'field',
    },
    {
      title: '外键关联',
      field: 'foreignField',
    },
  ] //
}
