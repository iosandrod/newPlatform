import { Base } from "@/base/base";

export class Button extends Base {
    config: any
    group: any
    constructor(config, group) {
        super()
        this.config = config
        this.group = group
        this.init()
    }
    init() {
        super.init()
    }
    getLabel() {
        let config = this.config
        let label = config.label || '按钮'//
        return label
    }
    runFn(_config) {
        try {

            let config = this.config
            let fn = config.fn
            if (typeof fn == 'function') {
                fn(_config)
            }
        } catch (error) {
            console.log('报错了')//
        }
    }
}