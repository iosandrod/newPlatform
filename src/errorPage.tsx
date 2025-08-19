import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorPage",
  setup() {
    return () => <div>系统出错了</div>;
  },
});