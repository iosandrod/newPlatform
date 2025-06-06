// /* istanbul ignore next */

// import Vue from 'vue'

// const isServer = Vue.prototype.$isServer
// const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g
// const MOZ_HACK_REGEXP = /^moz([A-Z])/
// const ieVersion = isServer ? 0 : Number(document.documentMode)

// /* istanbul ignore next */
// const trim = function (string) {
//   return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
// }
// /* istanbul ignore next */
// const camelCase = function (name) {
//   return name
//     .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
//       return offset ? letter.toUpperCase() : letter
//     })
//     .replace(MOZ_HACK_REGEXP, 'Moz$1')
// }

// /* istanbul ignore next */
// export const on = (function () {
//   if (!isServer && document.addEventListener) {
//     return function (element, event, handler) {
//       if (element && event && handler) {
//         element.addEventListener(event, handler, false)
//       }
//     }
//   } else {
//     return function (element, event, handler) {
//       if (element && event && handler) {
//         element.attachEvent('on' + event, handler)
//       }
//     }
//   }
// })()

// /* istanbul ignore next */
// export const off = (function () {
//   if (!isServer && document.removeEventListener) {
//     return function (element, event, handler) {
//       if (element && event) {
//         element.removeEventListener(event, handler, false)
//       }
//     }
//   } else {
//     return function (element, event, handler) {
//       if (element && event) {
//         element.detachEvent('on' + event, handler)
//       }
//     }
//   }
// })()

// /* istanbul ignore next */
// export const once = function (el, event, fn) {
//   var listener = function () {
//     if (fn) {
//       fn.apply(this, arguments)
//     }
//     off(el, event, listener)
//   }
//   on(el, event, listener)
// }

// /* istanbul ignore next */
// export function hasClass(el, cls) {
//   if (!el || !cls) {
//     return false
//   }
//   if (cls.indexOf(' ') !== -1) {
//     throw new Error('className should not contain space.')
//   }
//   if (el.classList) {
//     return el.classList.contains(cls)
//   } else {
//     return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
//   }
// }

// /* istanbul ignore next */
// export function addClass(el, cls) {
//   if (!el) {
//     return
//   }
//   var curClass = el.className
//   var classes = (cls || '').split(' ')

//   for (var i = 0, j = classes.length; i < j; i++) {
//     var clsName = classes[i]
//     if (!clsName) {
//       continue
//     }

//     if (el.classList) {
//       el.classList.add(clsName)
//     } else if (!hasClass(el, clsName)) {
//       curClass += ' ' + clsName
//     }
//   }
//   if (!el.classList) {
//     el.setAttribute('class', curClass)
//   }
// }

// /* istanbul ignore next */
// export function removeClass(el, cls) {
//   if (!el || !cls) {
//     return
//   }
//   var classes = cls.split(' ')
//   var curClass = ' ' + el.className + ' '

//   for (var i = 0, j = classes.length; i < j; i++) {
//     var clsName = classes[i]
//     if (!clsName) {
//       continue
//     }

//     if (el.classList) {
//       el.classList.remove(clsName)
//     } else if (hasClass(el, clsName)) {
//       curClass = curClass.replace(' ' + clsName + ' ', ' ')
//     }
//   }
//   if (!el.classList) {
//     el.setAttribute('class', trim(curClass))
//   }
// }

// /* istanbul ignore next */
// export const getStyle =
//   ieVersion < 9
//     ? function (element, styleName) {
//         if (isServer) {
//           return
//         }
//         if (!element || !styleName) {
//           return null
//         }
//         styleName = camelCase(styleName)
//         if (styleName === 'float') {
//           styleName = 'styleFloat'
//         }
//         try {
//           switch (styleName) {
//             case 'opacity':
//               try {
//                 return element.filters.item('alpha').opacity / 100
//               } catch (e) {
//                 return 1.0
//               }
//             default:
//               return element.style[styleName] || element.currentStyle
//                 ? element.currentStyle[styleName]
//                 : null
//           }
//         } catch (e) {
//           return element.style[styleName]
//         }
//       }
//     : function (element, styleName) {
//         if (isServer) {
//           return
//         }
//         if (!element || !styleName) {
//           return null
//         }
//         styleName = camelCase(styleName)
//         if (styleName === 'float') {
//           styleName = 'cssFloat'
//         }
//         try {
//           var computed = document.defaultView.getComputedStyle(element, '')
//           return element.style[styleName] || computed ? computed[styleName] : null
//         } catch (e) {
//           return element.style[styleName]
//         }
//       }

// /* istanbul ignore next */
// export function setStyle(element, styleName, value) {
//   if (!element || !styleName) {
//     return
//   }

//   if (typeof styleName === 'object') {
//     for (var prop in styleName) {
//       // eslint-disable-next-line no-prototype-builtins
//       if (styleName.hasOwnProperty(prop)) {
//         setStyle(element, prop, styleName[prop])
//       }
//     }
//   } else {
//     styleName = camelCase(styleName)
//     if (styleName === 'opacity' && ieVersion < 9) {
//       element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
//     } else {
//       element.style[styleName] = value
//     }
//   }
// }

// export const isScroll = (el, vertical) => {
//   if (isServer) {
//     return
//   }

//   const determinedDirection = vertical !== null && vertical !== undefined
//   const overflow = determinedDirection
//     ? vertical
//       ? getStyle(el, 'overflow-y')
//       : getStyle(el, 'overflow-x')
//     : getStyle(el, 'overflow')

//   return overflow.match(/(scroll|auto|overlay)/)
// }

// export const getScrollContainer = (el, vertical) => {
//   if (isServer) {
//     return
//   }

//   let parent = el
//   while (parent) {
//     if ([window, document, document.documentElement].includes(parent)) {
//       return window
//     }
//     if (isScroll(parent, vertical)) {
//       return parent
//     }
//     parent = parent.parentNode
//   }

//   return parent
// }

// export const isInContainer = (el, container) => {
//   if (isServer || !el || !container) {
//     return false
//   }

//   const elRect = el.getBoundingClientRect()
//   let containerRect

//   if ([window, document, document.documentElement, null, undefined].includes(container)) {
//     containerRect = {
//       top: 0,
//       right: window.innerWidth,
//       bottom: window.innerHeight,
//       left: 0
//     }
//   } else {
//     containerRect = container.getBoundingClientRect()
//   }

//   return (
//     elRect.top < containerRect.bottom &&
//     elRect.bottom > containerRect.top &&
//     elRect.right > containerRect.left &&
//     elRect.left < containerRect.right
//   )
// }

// utils/dom.js

const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

// Vue 3 替代 $isServer 的方式
const isServer = typeof window === 'undefined'

const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

const camelCase = function (name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, (_, __, letter, offset) =>
      offset ? letter.toUpperCase() : letter
    )
    .replace(MOZ_HACK_REGEXP, 'Moz$1')
}

export const on = function (element, event, handler) {
  if (!isServer && element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}

export const off = function (element, event, handler) {
  if (!isServer && element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}

export const once = function (el, event, fn) {
  const listener = function (...args) {
    if (fn) {
      fn.apply(this, args)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) {
    throw new Error('className should not contain space.')
  }
  return el.classList ? el.classList.contains(cls) : (` ${el.className} `).includes(` ${cls} `)
}

export function addClass(el, cls) {
  if (!el) return
  const classes = (cls || '').split(' ')
  for (let clsName of classes) {
    if (!clsName) continue
    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      el.className += ' ' + clsName
    }
  }
}

export function removeClass(el, cls) {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '
  for (let clsName of classes) {
    if (!clsName) continue
    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

export function getStyle(element, styleName) {
  if (isServer || !element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') styleName = 'cssFloat'
  try {
    const computed = getComputedStyle(element, null)
    return element.style[styleName] || computed[styleName] || ''
  } catch (e) {
    return element.style[styleName]
  }
}

export function setStyle(el, styleName, value) {
  if (!el || !styleName) return

  if (typeof styleName === 'object') {
    Object.entries(styleName).forEach(([prop, val]) => setStyle(el, prop, val))
  } else {
    styleName = camelCase(styleName)
    el.style[styleName] = value
  }
}

export const isScroll = (el, vertical) => {
  if (isServer) return false
  const overflow = vertical
    ? getStyle(el, 'overflowY')
    : getStyle(el, 'overflow')
  return /(scroll|auto|overlay)/.test(overflow)
}

export const getScrollContainer = (el, vertical) => {
  if (isServer) return null
  let parent = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) return window
    if (isScroll(parent, vertical)) return parent
    parent = parent.parentNode
  }
  return null
}

export const isInContainer = (el, container) => {
  if (isServer || !el || !container) return false
  const elRect = el.getBoundingClientRect()
  const containerRect =
    container === window || container === document || container === document.documentElement
      ? {
          top: 0,
          right: window.innerWidth,
          bottom: window.innerHeight,
          left: 0
        }
      : container.getBoundingClientRect()
  return (
    elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
  )
}
