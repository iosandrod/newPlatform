import { defineComponent, KeepAlive } from 'vue'
import designVue from './design'
export default defineComponent({
  name: 'PlatformIndex',
  components: {
    designVue, //
    KeepAlive,
  },
  setup() {
    return () => {
      // let com = (
      //   <div class="w-full h-full">
      //     <lowcode
      //       class="use-change-size"
      //       v-slots={{
      //         default: (path) => {
      //           let _com = (
      //             <KeepAlive>
      //               <designVue key={path}></designVue>
      //             </KeepAlive>
      //           )
      //           return _com
      //         },
      //       }}
      //     ></lowcode>
      //   </div>
      // )
      // return com //
      let com = <div>404</div>
      return com //
    }
  },
})
