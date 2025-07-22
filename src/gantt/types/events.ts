import type { ConnectionPoint, GanttBarObject } from "./bar"
import type { ChartRow, SortState } from "./chart"
import type { ExportResult } from "./export"
import type { ImportResult } from "./import"

/**
 * 通用任务条事件，包含任务条对象与鼠标事件
 */
export interface GanttBarEvent {
  bar: GanttBarObject              // 被操作的甘特图任务条
  e: MouseEvent                    // 原始鼠标事件
  datetime?: string | Date         // 可选，事件触发时对应的时间点（如悬停指针位置）
}

/**
 * 拖动任务条的事件，包括变动记录
 */
export interface GanttBarDragEvent extends GanttBarEvent {
  movedBars?: Map<
    GanttBarObject,
    {
      oldStart: string             // 拖动前的开始时间
      oldEnd: string              // 拖动前的结束时间
    }
  >
}

/**
 * 除去时间信息的任务条鼠标事件
 */
export type BarMouseEvent = Omit<GanttBarEvent, "datetime">

/**
 * 拖拽行排序事件
 */
export interface RowDragEvent {
  sourceRow: ChartRow             // 被拖动的原始行
  targetRow?: ChartRow           // 可选，目标行（用于嵌套场景）
  newIndex: number               // 插入的新索引
  parentId?: string | number     // 可选，插入的新父节点 ID（分组支持）
}

/**
 * 行展开/收起事件
 */
export interface RowExpansion {
  rowId: string | number         // 被展开或收起的行 ID
}

/**
 * 范围选择事件（鼠标框选）
 */
export interface RangeSelectionEvent {
  row: ChartRow                   // 所在行
  startDate: string | Date        // 选择起始时间
  endDate: string | Date          // 选择结束时间
  e: MouseEvent                   // 鼠标事件
}

/**
 * 排序事件
 */
export interface SortEvent {
  sortState: SortState            // 当前排序状态
}

/**
 * 开始连接两个任务条时触发的事件
 */
export interface ConnectionStartEvent {
  sourceBar: GanttBarObject       // 源任务条
  connectionPoint: ConnectionPoint // 连接起始点（start 或 end）
  e: MouseEvent                   // 鼠标事件
}

/**
 * 拖动连接线过程中的事件
 */
export interface ConnectionDragEvent {
  sourceBar: GanttBarObject       // 源任务条
  connectionPoint: ConnectionPoint // 起点类型
  currentX: number                // 当前鼠标 X 坐标
  currentY: number                // 当前鼠标 Y 坐标
  e: MouseEvent                   // 鼠标事件
}

/**
 * 完成连接两个任务条时触发的事件
 */
export interface ConnectionCompleteEvent {
  sourceBar: GanttBarObject       // 源任务条
  targetBar: GanttBarObject       // 目标任务条
  sourcePoint: ConnectionPoint    // 起点类型
  targetPoint: ConnectionPoint    // 终点类型
  e: MouseEvent                   // 鼠标事件
}

/**
 * 删除任务条连接线时触发的事件
 */
export interface ConnectionDeleteEvent {
  sourceBar: GanttBarObject
  targetBar: GanttBarObject
  e: MouseEvent
}

/**
 * 标签编辑事件（任务条文本修改）
 */
export interface LabelEditEvent {
  bar: GanttBarObject
  oldValue: string               // 编辑前的文本
  newValue: string               // 编辑后的文本
  e: MouseEvent
}

/**
 * GGanttChart 所有支持的组件事件定义（Emits 类型）
 */
export interface GGanttChartEmits {
  // 任务条的鼠标事件
  (e: "click-bar", value: GanttBarEvent): void
  (e: "mousedown-bar", value: GanttBarEvent): void
  (e: "mouseup-bar", value: GanttBarEvent): void
  (e: "dblclick-bar", value: GanttBarEvent): void
  (e: "mouseenter-bar", value: BarMouseEvent): void
  (e: "mouseleave-bar", value: BarMouseEvent): void
  (e: "dragstart-bar", value: BarMouseEvent): void
  (e: "drag-bar", value: BarMouseEvent): void
  (e: "dragend-bar", value: GanttBarDragEvent): void
  (e: "contextmenu-bar", value: GanttBarEvent): void

  // 排序事件
  (e: "sort", value: SortEvent): void

  // 分组展开/收起事件
  (e: "group-expansion", value: { rowId: string | number }): void

  // 拖动行排序事件
  (e: "row-drop", value: RowDragEvent): void

  // 进度条调整事件
  (e: "progress-change", value: BarMouseEvent): void
  (e: "progress-drag-start", value: BarMouseEvent): void
  (e: "progress-drag-end", value: BarMouseEvent): void

  // 任务条之间连接相关事件
  (e: "connection-start", value: ConnectionStartEvent): void
  (e: "connection-drag", value: ConnectionDragEvent): void
  (e: "connection-complete", value: ConnectionCompleteEvent): void
  (e: "connection-cancel", value: ConnectionStartEvent): void
  (e: "connection-delete", value: ConnectionDeleteEvent): void
  // 标签修改事件
  (e: "label-edit", value: LabelEditEvent): void
  // 导出相关事件
  (e: "export-start", format: string): void                    // 开始导出
  (e: "export-success", result: ExportResult): void            // 导出成功
  (e: "export-error", error: string): void                     // 导出失败

  // 导入事件
  (e: "import-data", value: ImportResult): void                // 导入数据成功

  // 框选事件（时间范围选择）
  (e: "range-selection", value: RangeSelectionEvent): void
}

export interface GGanttChartEventsProps {
  // 任务条的鼠标事件
  onClickBar?: (value: GanttBarEvent) => void
  onMousedownBar?: (value: GanttBarEvent) => void
  onMouseupBar?: (value: GanttBarEvent) => void
  onDblclickBar?: (value: GanttBarEvent) => void
  onMouseenterBar?: (value: BarMouseEvent) => void
  onMouseleaveBar?: (value: BarMouseEvent) => void
  onDragstartBar?: (value: BarMouseEvent) => void
  onDragBar?: (value: BarMouseEvent) => void
  onDragendBar?: (value: GanttBarDragEvent) => void
  onContextmenuBar?: (value: GanttBarEvent) => void

  // 排序事件
  onSort?: (value: SortEvent) => void

  // 分组展开/收起事件
  onGroupExpansion?: (value: { rowId: string | number }) => void

  // 拖动行排序事件
  onRowDrop?: (value: RowDragEvent) => void

  // 进度条调整事件
  onProgressChange?: (value: BarMouseEvent) => void
  onProgressDragStart?: (value: BarMouseEvent) => void
  onProgressDragEnd?: (value: BarMouseEvent) => void

  // 任务条之间连接相关事件
  onConnectionStart?: (value: ConnectionStartEvent) => void
  onConnectionDrag?: (value: ConnectionDragEvent) => void
  onConnectionComplete?: (value: ConnectionCompleteEvent) => void
  onConnectionCancel?: (value: ConnectionStartEvent) => void
  onConnectionDelete?: (value: ConnectionDeleteEvent) => void

  // 标签修改事件
  onLabelEdit?: (value: LabelEditEvent) => void

  // 导出相关事件
  onExportStart?: (format: string) => void
  onExportSuccess?: (result: ExportResult) => void
  onExportError?: (error: string) => void

  // 导入事件
  onImportData?: (value: ImportResult) => void

  // 框选事件（时间范围选择）
  onRangeSelection?: (value: RangeSelectionEvent) => void
}