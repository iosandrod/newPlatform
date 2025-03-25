import { defineComponent, inject } from "vue";
import breadCom from "./breadCom";
import { Form } from "@ER/form";
export default defineComponent({
    name: "FormBreadCom",
    components: { breadCom },
    setup() {
        let formIns: Form = inject('formIns')
        const ns = formIns.hooks.useNamespace('Config');
        return () => {
            const subBar = formIns.getBarsValue()
            let com = <breadCom items={subBar} itemClick={(item) => {
                let config = item.config
                let formId = config.formId
                formIns.formTabClick(formId)////
            }} v-slots={{
                default: (item) => {
                    let config = item.config
                    let title = config.title////
                    return <div>{title}</div>
                }
            }} class={[ns.e('breadcrumb')]} separator-icon={() => (
                <svg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        fill='currentColor'
                        d='M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z'
                    />
                </svg>
            )} ></breadCom>
            return com
        };
    },
});