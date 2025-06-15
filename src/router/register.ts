// src/utils/routeParser.ts
import type { RouteRecordRaw } from 'vue-router'

// 注意：这里的泛型声明告诉 TS，每个模块都有一个 default 导出
const modules = import.meta.glob<{ default: any }>(
  '@/pages/**/index.{vue,tsx}',
  {
    eager: true,
  },
)

export function generateRoutes(): any {
  // return routes
  const result: Record<string, RouteRecordRaw[]> = {}

  Object.entries(modules).forEach(([filePath, module]) => {
    const parts = filePath.split('/')
    // 找到 'pages' 这个目录在 parts 中的索引
    const pagesIdx = parts.findIndex((p) => p === 'pages')
    // slice 出 'erp', 'home' 或者 ['erp'] 这类真正的路由段
    const segments = parts.slice(pagesIdx + 1, -1)

    const moduleName = segments[0] // eg. 'erp'
    let path = '/' + segments.slice(1).join('/') // eg. '/erp/home'
    if (path == '/') {
      path = ':tableName' //
    }
    const name = segments.join('-') // eg. 'erp-home'
    // console.log(module,'test')//
    const route: RouteRecordRaw = {
      path,
      name,
      component: module.default,
    } //
    if (!result[moduleName]) {
      result[moduleName] = []
    } //
    result[moduleName].push(route)
  })

  return result
}
