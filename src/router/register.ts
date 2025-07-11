// src/utils/routeParser.ts
import type { RouteRecordRaw } from 'vue-router'

// 注意：这里的泛型声明告诉 TS，每个模块都有一个 default 导出
const modules = import.meta.glob<{ default: any }>(
  '@/pages/**/index.{vue,tsx}',
  {
    eager: true,
  },
)

// export function generateRoutes(): any {
//   // return routes
//   const result: Record<string, RouteRecordRaw[]> = {}

//   Object.entries(modules).forEach(([filePath, module]) => {
//     const parts = filePath.split('/')
//     // 找到 'pages' 这个目录在 parts 中的索引
//     const pagesIdx = parts.findIndex((p) => p === 'pages')
//     // slice 出 'erp', 'home' 或者 ['erp'] 这类真正的路由段
//     const segments = parts.slice(pagesIdx + 1, -1)

//     const moduleName = segments[0] // eg. 'erp'
//     let path = '/' + segments.slice(1).join('/') // eg. '/erp/home'
//     if (path == '/') {
//       path = ':tableName' //
//     }
//     const name = segments.join('-') // eg. 'erp-home'
//     // console.log(module,'test')//
//     const route: RouteRecordRaw = {
//       path,
//       name,
//       component: module.default,
//     } //
//     if (!result[moduleName]) {
//       result[moduleName] = []
//     } //
//     result[moduleName].push(route)
//   })
//   return result
// }

// export function generateRoutes(): RouteRecordRaw[] {
//   // 暂存按 moduleName 分组后的 RouteRecordRaw
//   const map: Record<string, RouteRecordRaw> = {}

//   Object.entries(modules).forEach(([filePath, module]) => {
//     const parts = filePath.split('/')
//     const pagesIdx = parts.findIndex((p) => p === 'pages')
//     const segments = parts.slice(pagesIdx + 1, -1) // ['erp'], ['erp','home'], ['erp','home','detail']...

//     if (segments.length === 0) return

//     const moduleName = segments[0] // 'erp'
//     const rawPath = segments.slice(1).join('/') // '', 'home', 'home/detail'
//     let path = rawPath ? `/${rawPath}` : '/' // '/', '/home', '/home/detail'
//     // 针对根列表页做特别处理
//     if (path === '/') {
//       path = ':tableName'
//     }

//     const name = segments.join('-') // 'erp', 'erp-home', 'erp-home-detail'
//     const route: RouteRecordRaw = {
//       path,
//       name,
//       component: module.default,
//     }

//     // 如果还没创建父路由，就先初始化一个“壳”
//     if (!map[moduleName]) {
//       map[moduleName] = {
//         path: `/${moduleName}`,
//         name: moduleName,
//         component: /* 可以放一个布局组件 Layout */ module.default,
//         children: [],
//       }
//     }

//     // 将当前 route 放到父路由的 children
//     map[moduleName].children!.push(route)
//   })

//   // 返回所有父路由
//   let _res = Object.values(map)
//   console.log(_res, 'testRes')//
//   return _res //
// }

// modules 由 import.meta.globEager 或者类似方式得到：

export function generateRoutes(): RouteRecordRaw[] {
  // 临时存父路由和第二级路由的 map
  const list = Object.entries(modules).map(([filePath, module]) => {
    const parts = filePath.split('/')
    const idx = parts.findIndex((p) => p === 'pages')
    const segments = parts.slice(idx + 1, -1) // 比如 ['erp'], ['erp','home'], ['erp','home','detail']…
    return { segments, module }
  })

  // 2. 按 segments.length 升序排序——深度越浅的路由越先处理
  list.sort((a, b) => a.segments.length - b.segments.length)

  // 3. 跟之前一样构建一级、二级、三级路由容器
  const rootMap: Record<string, RouteRecordRaw> = {}
  const secondMap: Record<string, Record<string, RouteRecordRaw>> = {}

  for (const { segments, module } of list) {
    if (segments.length === 0) continue

    const [moduleName, ...rest] = segments

    // 一级 /erp
    if (!rootMap[moduleName]) {
      rootMap[moduleName] = {
        path: `/${moduleName}`,
        name: moduleName,
        component: module.default,
        children: [],
      }
      secondMap[moduleName] = {}
    }
    const rootRoute = rootMap[moduleName]!

    // 根页： pages/erp/index.vue → /erp
    if (rest.length === 0) {
      rootRoute.children!.push({
        path: '',
        name: moduleName,
        component: module.default,
      })
      continue
    }

    // 二级及更深
    const [secondName, ...kids] = rest

    // 二级 /erp/home
    if (!secondMap[moduleName][secondName]) {
      secondMap[moduleName][secondName] = {
        path: secondName,
        name: `${moduleName}-${secondName}`,
        component: module.default, //
        children: [],
      }
      rootRoute.children!.push(secondMap[moduleName][secondName])
    }
    const secondRoute = secondMap[moduleName][secondName]!

    // 二级页本身： pages/erp/home.vue → /erp/home
    if (kids.length === 0) {
      secondRoute.children!.push({
        path: '',
        name: `${moduleName}-${secondName}`,
        component: module.default,
      })
    } else {
      // 三级或更深：拼接成 a/b/c…
      const childPath = kids.join('/')
      secondRoute.children!.push({
        path: childPath,
        name: segments.join('-'),
        component: module.default,
      })
    }
  }
  //默认路由
  let _obj = {}
  // 返回所有一级路由
  let res = Object.values(rootMap).reduce((res, item) => {
    let name = item.name
    // console.log(item, 'testItem')//
    res[name] = item.children.filter((v) => {
      return v.path != ''
    }) //
    item.path = ':pathMatch(.*)*' //
    item.children = [] //
    _obj[name] = item //
    return res
  }, {}) //
  let filterChildren = (item) => {
    if (!Array.isArray(item.children)) {
      return //
    }
    item.children = item.children.filter((v) => {
      let s = v.path != ''

      return s
    })
    item.children.forEach((v) => {
      filterChildren(v)
    })
  }
  Object.entries(res).forEach((obj: any) => {
    let [key, item] = obj
    item.forEach((v) => {
      filterChildren(v)
    })
    let _p = _obj[key]
    if (_p) {
      item.push(_p) //
    }
  })
  let addPatchAny = (item) => {
    let children = item.children
    if (!Array.isArray(children)) {
      return //
    }
    let path = item.path //
    if (path == ':pathMatch(.*)*') {
      return
    }
    let hasPath = children.find((v) => {
      return v.path == ':pathMatch(.*)*'
    })
    if (hasPath == null) {
      children.push({
        path: ':pathMatch(.*)*',
        name: `${item.name}-pathMatch(.*)*`,
        component: item.component, //
      })
    }
    children.forEach((v) => {
      addPatchAny(v)
    }) //
  }
  Object.values(res).forEach((items: any) => {
    items.forEach((v) => {
      addPatchAny(v) //
    })
  })
  return res as any
}
