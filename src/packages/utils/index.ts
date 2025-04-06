import _ from 'lodash'
// const importModules = import.meta.glob('./*.js', { eager: true })
// const modules = {}
// _.forIn(importModules, (func, path) => {
//   Object.keys(func).forEach((key) => {
//     modules[key] = func[key]
//   })
// })
//   const importModules1 = import.meta.glob('./*.ts', { eager: true })
// _.forIn(importModules1, (func, path) => {
//   Object.keys(func).forEach((key) => {
//     modules[key] = func[key]
//   })
// })
// export default { 
//   ...modules
// }

import * as addContext from './addContext'
import * as device from './device'
import * as nanoid from './nanoid'
import * as fileData from './fileData'
import * as logic from './logic'
import * as test from './test'
import * as utils from './utils'
import * as field from './field'
export default {
  ...addContext,
  ...device,
  ...nanoid,
  ...fileData,
  ...logic,
  ...test,
  ...utils,
  ...field
}
export * from './addContext'
export * from './device'
export * from './nanoid'
export * from './fileData'
export * from './logic'
export * from './test'
export * from './utils'
export * from './field' 