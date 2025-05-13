import { Base } from '@ER/base'

export class UpLoad extends Base {
  config: any
  constructor(config) {
    super()
    this.config = config
  }
  async upload(config) {
    let file: File = config.file
    let uri = await this.fileToDataURL(file)
    console.log(uri, 'testUri') ////
  }
  fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        // reader.result 就是完整的 data URI
        resolve(reader.result)
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }
}
