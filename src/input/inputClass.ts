import { Base } from '@ER/base'
import { VxeInputInstance } from 'vxe-pc-ui'

export class Input extends Base {
  config: any
  constructor(config) {
    super()
    this.config = config //
  }
  getDatePanelVisible() {
      let input: VxeInputInstance = this.getRef('input')
      if (input) {
        return input.reactData.isAniVisible //
      }
  }
  getModelValue() {
    let config = this.config
    let modelValue = config.modelValue
    return modelValue //
  }
  focus() {
    let input: VxeInputInstance = this.getRef('input')
    if (input) {
      input.focus() //
    } //
  }
  blur() {
    let input: VxeInputInstance = this.getRef('input')
    if (input) {
      input.blur() //
    } //
  } //
}
