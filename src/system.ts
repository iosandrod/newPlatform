import { reactive } from "vue";
import { Client } from "./service/client";
export class System {
    systemConfig = {}
    selectOptions = {}
    async login() {

    }
}

export const system = reactive(new System())//