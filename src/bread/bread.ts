import { Base } from "@/base/base";
import { BreadItem } from "./breaditem";

export class Bread extends Base {
    config: any = {}
    breaditems: BreadItem[] = []
    constructor(config) {
        super()
        this.config = config
        this.init()//
    }
    init(): void {
        super.init()//
        let config = this.config
        let items = config.items || []
        this.setBreadItems(items)
    }
    setBreadItems(items) {
        this.breaditems.splice(0)//
        for (const item of items) {
            this.addBreadItem(item)
        }
    }//

    addBreadItem(item) {
        let _item = new BreadItem(item, this)
        this.breaditems.push(_item)// 
    }
}

