import { defineComponent, KeepAlive } from 'vue'
import lowcode from './lowcode'
import designVue from './design'
export default defineComponent({
  name: 'PlatformIndex',
  components: {
    lowcode,
    designVue, //
    KeepAlive,
  },
  setup() {
    return () => {
      // let com = (
      //   <div class="w-full h-full my-scope">
      //     <lowcode
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
      let com = <div>404</div>
      return com //
    }
  },
})
