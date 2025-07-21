import { dayjs, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { computed } from 'vue'

import type { GanttBarObject, GGanttChartConfig } from '../types'
import provideConfig from '../provider/provideConfig'

/**
 * Default date format used throughout the Gantt chart
 * Format includes both date and time components
 */
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm'

/**
 * A composable that provides date manipulation utilities using dayjs
 * Centralizes date handling logic for consistency across the Gantt chart
 * @param config - Optional Gantt chart configuration. If not provided, uses default config
 * @returns Object containing date manipulation methods and computed properties
 */
export default function useDayjsHelper(
  config: GGanttChartConfig = provideConfig(),
) {
  const toDayjs = (
    input: string | Date | GanttBarObject,
    startOrEnd?: 'start' | 'end',
  ) => {
    let value: string | undefined

    if (
      startOrEnd !== undefined &&
      typeof input !== 'string' &&
      !(input instanceof Date)
    ) {
      value =
        startOrEnd === 'start' ? input[barStart.value] : input[barEnd.value]
    }

    if (typeof input === 'string') {
      value = input
    } else if (input instanceof Date) {
      return dayjs(input)
    }

    if (!value) return dayjs(NaN)

    let format = dateFormat.value || DEFAULT_DATE_FORMAT

    // 自动补上时间（如果格式要求有时间）
    const needsTime = format.includes('HH') || format.includes('mm')
    if (needsTime && /^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
      value += ' 00:00'
    }
    // console.log(value,format,'testFormat','testValue')//
    //@ts-ignore
    value = new Date(value)
    // console.log(value,'testValue')//
    const obj = dayjs(value) // 严格模式
    return obj.isValid() ? obj : dayjs(NaN)
  } //
  const { chartStart, chartEnd, barStart, barEnd, dateFormat, locale } = config
  
  const chartStartDayjs = computed(() => {
    let d = toDayjs(chartStart.value)
    return d
  })
  /**
   * Computed property for the chart end date as a dayjs object
   */
  const chartEndDayjs = computed(() => toDayjs(chartEnd.value))

  /**
   * Sets the locale for date formatting
   */
  dayjs.locale(locale.value)

  /**
   * Converts various input types to a dayjs object
   * Handles bar objects, date strings, and Date objects
   * @param input - Value to convert to dayjs object
   * @param startOrEnd - Optional parameter to specify which date to use from a bar object
   * @returns Dayjs object
   */

  /**
   * Formats a date value according to specified pattern
   * @param input - Date value to format
   * @param pattern - Optional format pattern
   * @returns Formatted date string or Date object
   */
  const format = (input: string | Date, pattern?: string | false) => {
    if (pattern === false) {
      return input instanceof Date ? input : dayjs(input).toDate()
    }
    const inputDayjs =
      typeof input === 'string' || input instanceof Date
        ? toDayjs(input)
        : input

    return inputDayjs.format(pattern)
  }

  /**
   * Calculates the difference in days between chart start and end dates
   * @returns Number of days between start and end dates
   */
  const diffDates = () => {
    return chartEndDayjs.value.diff(chartStartDayjs.value, 'day')
  }

  return {
    chartStartDayjs,
    chartEndDayjs,
    toDayjs,
    format,
    diffDates,
  }
}
