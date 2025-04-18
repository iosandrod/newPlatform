import { Base } from '@ER/base'

export class Select extends Base {
  searchValue: string = ''
  config: any
  constructor(config) {
    super()
    this.config = config //
  }
}
