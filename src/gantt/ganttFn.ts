
// 时间精度可选项，用于决定时间轴显示的粒度
const availablePrecisions = ['hour', 'day', 'week', 'month']
// 'hour'：按小时显示
// 'day'：按天显示
// 'week'：按周显示
// 'month'：按月显示

// 支持的本地化语言代码（用于日期、本地化 UI 文本等）
const availableLocales = ['en', 'it', 'fr', 'de', 'es']
// 'en'：英文
// 'it'：意大利语
// 'fr'：法语
// 'de'：德语
// 'es'：西班牙语

// 连线类型，用于任务依赖连接的视觉表现
const availableConnectionTypes = ['bezier', 'straight', 'squared']
// 'bezier'：贝塞尔曲线（柔和的曲线）
// 'straight'：直线连接
// 'squared'：折线连接（直角线）

// 连线样式，用于控制任务依赖线的样式
const availableConnectionPatterns = ['solid', 'dash', 'dot', 'dashdot']
// 'solid'：实线
// 'dash'：虚线
// 'dot'：点状线
// 'dashdot'：点划线

// 连线动画速度（如果支持动画或动态高亮）
const availableConnectionSpeeds = ['slow', 'normal', 'fast']
// 'slow'：慢速
// 'normal'：常速
// 'fast'：快速

// 箭头类型，用于连线末尾的指示箭头
const availableMarkerTypes = ['none', 'forward', 'bidirectional']
// 'none'：无箭头
// 'forward'：单向箭头（指向目标）
// 'bidirectional'：双向箭头（起点与终点都带箭头）

// 日期显示方式，用于时间轴或日期标签
const availableDayOptions = ['day', 'name', 'doy', 'number']
// 'day'：显示日期，如 21
// 'name'：显示星期名，如 Monday
// 'doy'：Day of Year，年份中的第几天
// 'number'：某种编号（视实现而定）

// 导出格式选项
const availableExportFormats = ['pdf', 'png', 'svg', 'excel']
// 'pdf'：导出为 PDF 文档
// 'png'：导出为 PNG 图片
// 'svg'：导出为矢量 SVG 图像
// 'excel'：导出为 Excel 表格

// 纸张大小选项（用于导出、打印）
const availablePaperSizes = ['a4', 'a3', 'letter', 'legal']
// 'a4'：标准 A4 纸
// 'a3'：标准 A3 纸（比 A4 大）
// 'letter'：北美信纸大小
// 'legal'：法律文件大小（比 letter 更长）

// 页面方向选项（用于打印或导出）
const availableOrientations = ['portrait', 'landscape']
// 'portrait'：纵向
// 'landscape'：横向

// 任务之间的依赖关系类型（常用于甘特图）
const availableConnectionRelations = ['FS', 'SS', 'FF', 'SF']
// 'FS'（Finish to Start）：前任务完成 → 后任务开始（最常见）
// 'SS'（Start to Start）：前任务开始 → 后任务开始
// 'FF'（Finish to Finish）：前任务完成 → 后任务完成
// 'SF'（Start to Finish）：前任务开始 → 后任务完成（较少见）