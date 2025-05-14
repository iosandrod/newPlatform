import { Base } from '@ER/base'

export class UpLoad extends Base {
  config: any
  constructor(config) {
    super()
    this.config = config
  }
  async upload(config) {
    let file: File = config.file
    const http = this.getHttp()
    let _res = await http.uploadFile(file)
    // console.log(_res, 'test_res') //
    let row = _res?.[0]
    let url = row?.url
    if (url == null) {
      return Promise.reject({ message: '上传失败' })
    }
    let onChange = this.config.onChange
    if (typeof onChange == 'function') {
      onChange({ value: url }) //
    }
    return url
  }
}
