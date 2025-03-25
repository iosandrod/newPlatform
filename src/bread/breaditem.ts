import { Base } from "@/base/base";
import { Bread } from "./bread";

export class BreadItem extends Base {
    config: any = {}
    bread: Bread
    constructor(config, bread) {
        super()
        this.bread = bread
        this.config = config
        this.init()
    }
    init(): void {
        super.init()
    }
    getBindValue() {
        let config = this.config
        let id = config.id
        let _id = this.id
        if (id == null) {
            id = _id
        }
        let obj = {
            index: id
        }
        return obj
    }
}