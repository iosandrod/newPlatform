import { BaseEditor } from './baseEdit'

export interface EditorConfig {
  readonly?: boolean
}

export interface ReferencePosition {
  rect?: DOMRect
}

export interface OnStartParams {
  table?: ListTable
  value?: string
  referencePosition?: ReferencePosition
  container: HTMLElement
  endEdit: () => void
}
import { createApp, isReactive } from 'vue' //
import {} from 'element-plus' //
import { VxeInput } from 'vxe-pc-ui'
import tableInput from './tableInput'
import { ListTable } from '@visactor/vtable'
import { Column } from '../column'
export class InputEditor extends BaseEditor {
  row?: any
  column?: Column
  app: any
  private editorType: string = 'Input'
  private editorConfig?: EditorConfig
  private element?: HTMLDivElement
  private container!: HTMLElement
  private successCallback?: () => void

  constructor(editorConfig?: any) {
    super()
    this.editorConfig = editorConfig
  }

  createElement(): void {
    const el = document.createElement('div')
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.position = 'absolute'
    el.style.boxSizing = 'border-box'
    el.style.backgroundColor = '#FFFFFF' //
    let colFn: any = this.editorConfig
    const column: Column = colFn()
    const table = column.table
    let select = table.getCurrentSelectRow()
    let _row = select[0]
    this.column = column
    this.row = _row
    let field = column.getField()
    let _value = _row[field]
    column.cacheValue = _value
    let app = createApp(tableInput, {
      column: column, //这是个函数
      row: _row,
      onChange: (v) => {
      },
      style: {
        width: '100%',
        height: '100%',
      },
    })
    app.mount(el)
    this.app = app
    this.element = el
    this.container.appendChild(el) //
  }

  setValue(value?: string): void {
    if (this.element) {
      //@ts-ignore
      this.element.value = value !== undefined ? value : '' //
    }
  } //
  //@ts-ignore
  targetIsOnEditor?: (target: HTMLElement) => boolean = (target) => {
    //@ts-ignore
    let status = this.column.getCanHidden() ////
    // console.log(status, 'status') ////
    return status ////
  }
  getValue(): string {
    //@ts-ignore
    return this.column.cacheValue //
  }
  //@ts-ignore
  exit?: () => void = () => {}
  onStart(config: OnStartParams): void {
    const { value, referencePosition, container, endEdit, table } = config
    const row = table
    this.container = container
    this.successCallback = endEdit
    if (!this.element) {
      this.createElement()
      if (value !== undefined) {
        this.setValue(value)
      }
      if (referencePosition?.rect) {
        this.adjustPosition(referencePosition.rect)
      }
    }
  }
  onEnd(): void {
    const app = this.app //
    app.unmount() //
    if (this.container?.contains(this.element!)) {
      this.container.removeChild(this.element!)
    }
    let column = this.column
    let value = column.cacheValue
    if (column.isChangeValue == true && column.isChangeValue == true) {
      //
      let oldValue = this.row[column.getField()] //
      if (value != oldValue) {
        column.updateBindValue({
          value: value,
          row: this.row, //
        })
      }
    } //
    column.cacheValue = undefined //
    column.isChangeValue = false //
    this.element = undefined //
    this.column = null ////
    this.row = null //
  } //
  adjustPosition(rect: DOMRect): void {
    if (this.element) {
      Object.assign(this.element.style, {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      })
    }
  }

  endEditing(): void {}

  isEditorElement(target: EventTarget | null): boolean {
    return target === this.element
  } //
  validateValue(
    newValue: string,
    oldValue: string,
    position: any,
    table: any,
  ): boolean {
    return true //
  }
}
