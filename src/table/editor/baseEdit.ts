import {
  CellAddress,
  EditContext,
  IEditor,
  ReferencePosition,
  ValidateEnum,
} from '@visactor/vtable-editors'

export class BaseEditor implements IEditor {
  onStart(context: EditContext<any, any> | any): any {}
  onEnd() {}
  isEditorElement(target): boolean {
    return true
  }
  validateValue (
    newValue?: any,
    oldValue?: any,
    position?: CellAddress,
    table?: any,
  ):any {}
  getValue() {}
  beginEditing?: (
    container: HTMLElement,
    referencePosition: ReferencePosition,
    value: any,
  ) => void
  exit?: () => void
  targetIsOnEditor?: (target: HTMLElement) => boolean
  bindSuccessCallback?: (callback: () => void) => void
}
