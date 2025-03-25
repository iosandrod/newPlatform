import { Base } from "@ER/base";
import { Service } from "@feathersjs/feathers";
import { client } from '@/service/client'
export class fService extends Base {
    client = client
    config: any
    service: Service
    layout: any = {}
    state: any = {}
    fields: any = {}
    selected: any = {}//
    constructor(config: any) {
        super()
        this.config = config//
    }
    init() { }
    designCurrentPage() {

    }
}