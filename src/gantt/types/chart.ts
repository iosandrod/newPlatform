// 导入 Gantt 图相关的类型
import type { GanttBarConnection, GanttBarObject } from "./bar"

/**
 * 表示甘特图中每一行的数据结构
 */
export interface ChartRow {
  id: string | number                     // 行的唯一标识符
  label: string                           // 显示在标签列中的文本
  bars: GanttBarObject[]                  // 当前行包含的任务条（bar）
  children?: ChartRow[]                   // 可选，子任务/子行（嵌套结构）
  connections?: GanttBarConnection[]      // 可选，当前行内的连接线
  _originalNode?: any                     // 可选，原始数据节点（供内部使用）
}

/**
 * 时间单位，用于时间轴或缩放设置
 */
export type TimeUnit = "hour" | "day" | "date" | "week" | "month"

/**
 * 连接线的类型
 */
export type ConnectionType = "bezier" | "straight" | "squared"

/**
 * 连接线的样式模式
 */
export type ConnectionPattern = "solid" | "dot" | "dash" | "dashdot"

/**
 * 连接线动画速度
 */
export type ConnectionSpeed = "slow" | "normal" | "fast"

/**
 * 甘特图任务之间的依赖关系类型（Finish-Start 等）
 */
export type ConnectionRelation = "FS" | "SS" | "FF" | "SF"

/**
 * 排序方向
 */
export type SortDirection = "asc" | "desc" | "none"

/**
 * 标签列可用的字段名称（内置字段）
 */
export type LabelColumnField = "Id" | "Label" | "StartDate" | "EndDate" | "Duration" | "Progress"

/**
 * 时间轴上的“天”单位显示方式
 */
export type DayOptionLabel = "day" | "doy" | "name" | "number"

/**
 * 节点标记的连接方向
 */
export type MarkerConnection = "none" | "forward" | "bidirectional"

/**
 * 自定义排序函数定义
 */
export type SortFunction = (a: ChartRow, b: ChartRow) => number

/**
 * 标签列的配置项
 */
export interface LabelColumnConfig {
  field: LabelColumnField | string             // 字段名称
  sortable?: boolean                           // 是否允许排序
  valueGetter?: (row: ChartRow) => string | number // 可选，自定义字段取值函数
  sortFn?: SortFunction                        // 可选，自定义排序函数
}

/**
 * 当前的排序状态
 */
export interface SortState {
  column: string                  // 排序字段
  direction: SortDirection        // 排序方向
}

/**
 * 表示时间轴上的某个单位（如某小时、某天等）
 */
export interface TimeaxisUnit {
  label: string                   // 显示标签
  value?: string                  // 可选，实际值
  date: Date                      // 对应的时间
  width?: string                  // 可选，该单位在界面上占据的宽度
  isHoliday?: boolean             // 是否为节假日
  holidayName?: string            // 节假日名称
  holidayType?: string            // 节假日类型
}

/**
 * 甘特图上的里程碑信息
 */
export interface GanttMilestone {
  id: string
  date: string
  name: string
  description?: string
  color?: string                  // 可选，里程碑颜色
}

/**
 * 时间轴上的标记事件（比如节日、阶段分界等）
 */
export interface TimeaxisEvent {
  id: string
  label: string
  startDate: string | Date        // 事件起始时间
  endDate: string | Date          // 事件结束时间
  color?: string                  // 文本颜色
  backgroundColor?: string        // 背景颜色
  description?: string            // 可选说明
  width?: string                  // 可选，事件宽度
  xPosition?: number              // 可选，横向偏移位置
}

/**
 * 一次完整的时间轴计算结果，包括上层单位、下层单位和事件
 */
export interface TimeaxisResult {
  upperUnits: TimeaxisUnit[]      // 上层单位（如：月）
  lowerUnits: TimeaxisUnit[]      // 下层单位（如：日）
  events: TimeaxisEvent[]         // 时间轴事件（如节假日、项目起止）
}

/**
 * 时间轴的原始数据结构，用于绘制甘特图头部
 */
export interface TimeaxisData {
  result: TimeaxisResult          // 计算后的时间轴结构
  globalMinuteStep: string[]      // 全局每分钟刻度（用于高精度缩放）
}

/**
 * 甘特图时间轴组件的实例对象
 */
export interface GGanttTimeaxisInstance {
  timeaxisUnits: TimeaxisData     // 时间轴数据
  timeaxisElement: HTMLElement | null  // 绑定的 DOM 元素（可能为空）
}

/**
 * 节假日定义
 */
export interface Holiday {
  date: Date                      // 节假日时间
  name: string                    // 节假日名称
  type: string                    // 节假日类型（如国家法定、公司安排）
}
