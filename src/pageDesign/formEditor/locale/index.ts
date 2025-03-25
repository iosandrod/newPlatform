import _ from 'lodash'
// const importModules = import.meta.glob('./*.js', { import: 'setup' })
const importModules = import.meta.glob('./*.ts', { import: 'default', eager: true })
const modules = {}
_.forIn(importModules, (func, path) => {
  const re = /[a-zA-Z0-9_-]*(?=\.ts)/g 
  modules[path.match(re)[0]] = func
})
export default modules
 