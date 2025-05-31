// import Vue from 'vue'

// export function swap(arr, i, j) {
//   const temp = arr[i]
//   Vue.set(arr, i, arr[j])
//   Vue.set(arr, j, temp)
// }

// export function deepCopy(obj, cache = []) {
//   if (obj === null || typeof obj !== 'object') {
//     return obj
//   }
//   const objType = Object.prototype.toString.call(obj).slice(8, -1)
//   // 考虑 正则对象的copy
//   if (objType === 'RegExp') {
//     return new RegExp(obj)
//   }
//   // 考虑 Date 实例 copy
//   if (objType === 'Date') {
//     return new Date(obj)
//   }
//   // 考虑 Error 实例 copy
//   if (objType === 'Error') {
//     return new Error(obj)
//   }
//   const hit = cache.filter((c) => c.original === obj)[0]
//   if (hit) {
//     return hit.copy
//   }
//   const copy = Array.isArray(obj) ? [] : {}
//   cache.push({ original: obj, copy })
//   Object.keys(obj).forEach((key) => {
//     copy[key] = deepCopy(obj[key], cache)
//   })
//   return copy
// }

// export function $(selector) {
//   return document.querySelector(selector)
// }

// const components = ['RoyText', 'RoyRect', 'RoyCircle', 'RoyTran']

// export function isPreventDrop(component) {
//   return !components.includes(component) && !component.startsWith('SVG')
// }
import { nanoid } from 'nanoid'
import { getCurrentInstance } from 'vue'
export function swap(arr, i, j) {
  // Vue 3 响应式数组直接赋值即可保持响应式
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

export function deepCopy(obj, cache = []) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  const objType = Object.prototype.toString.call(obj).slice(8, -1)
  if (objType === 'RegExp') {
    return new RegExp(obj)
  }
  if (objType === 'Date') {
    return new Date(obj)
  }
  if (objType === 'Error') {
    return new Error(obj)
  }
  const hit = cache.find((c) => c.original === obj)
  if (hit) {
    return hit.copy
  }
  const copy = Array.isArray(obj) ? [] : {}
  cache.push({ original: obj, copy })
  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache)
  })
  return copy
}

export function $(selector) {
  return document.querySelector(selector)
}

const components = ['RoyText', 'RoyRect', 'RoyCircle', 'RoyTran']

export function isPreventDrop(component) {
  return !components.includes(component) && !component.startsWith('SVG')
}

/**
 * Returns a random ID of given length (default 8).
 */
export function getUuid(length = 8) {
  return nanoid(length)
}

/**
 * Returns true if value is undefined, null, or ''.
 */
export function isBlank(value) {
  return value === undefined || value === null || value === ''
}

/**
 * Walks up the component tree to find a parent whose name (or componentName)
 * matches the given `name`. Returns the parent instance proxy or `false`.
 *
 * Usage (in <script setup> or setup()):
 *   const parent = findParentComponent('SomeParentName')
 *   if (parent) { ... }
 *
 * Note: in Composition API, to get the current component instance, call getCurrentInstance().
 */
export function findParentComponent(name) {
  const internal = getCurrentInstance()
  if (!internal) {
    console.warn('[findParentComponent] must be called inside setup()')
    return false
  }
  let parent = internal.proxy.$parent
  while (parent) {
    // In Vue 3, user-defined component name is in `.type.name`
    const componentName = parent.$options.name || parent.$options.componentName
    if (componentName === name) {
      return parent
    }
    parent = parent.$parent
  }
  return false
}
