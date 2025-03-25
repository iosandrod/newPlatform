export const isEmpty = (v) => (v === '' || v === null || v === undefined || (Array.isArray(v) && !v.length))
import { globalConfig } from '@DESIGN/formEditor/componentsConfig'
import _ from 'lodash'
import { nanoid } from 'nanoid'
export const generateOptions = (len) => {
  const result = []
  while (len--) {
    result.push({
      label: 'Option',
      value: nanoid()
    })
  }
  return result
}
export const generateData = (layoutType = 1) => {
  const result: any = {
    config: _.cloneDeep(globalConfig)
  }
  result.logic = result.data = {}
  if (layoutType === 1) {
    result.list = []
  }
  if (layoutType === 2) {
    result.layout = []
  }
  return result
}
