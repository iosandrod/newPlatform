import {
  computed,
  defineComponent,
  watch,
  ref,
  reactive,
  onBeforeUnmount,
  provide,
  Teleport,
  nextTick,
  withDirectives,
  vShow,
} from 'vue'
import type { PropType } from 'vue'

import type {
  TriggerEventType,
  ReferenceOptions,
  ShowOptions,
  AddReferenceOptions,
} from '../types'

import { CLASSES } from '../constants'

const DEFAULT_REFERENCE_OPTIONS: {
  trigger: TriggerEventType[]
} = {
  trigger: ['contextmenu'],
}

const Contextmenu = defineComponent({
  name: 'VContextmenu',

  props: {
    items: {},
    modelValue: {
      type: Boolean,
      default: false,
    },
    autoAdjustPlacement: {
      type: Boolean,
      default: true,
    },
    disabled: {
      //
      default: false,
    },
    teleport: {
      type: [String, Object] as PropType<string | Element>,
      default: () => 'body',
    },
    preventContextmenu: {
      type: Boolean,
      default: true,
    },
    isTeleport: {
      type: Boolean,
      default: true,
    },
    alwaysShow: {
      type: Boolean,
      default: false,
    },
    // destroyOnHide: {
    //   type: Boolean,
    //   default: false,
    // },
  },

  emits: ['show', 'hide', 'update:modelValue', 'contextmenu'],

  setup(props, { emit, slots, expose }) {
    const contextmenuRef = ref<HTMLDivElement | null>(null)

    const visible = ref(props.modelValue || false)
    const toggle = (value: boolean) => {
      // if (1 == 1 && value == false) {
      //   return
      // }
      visible.value = value
      emit('update:modelValue', value)
    }
    const position = ref({ top: 0, left: 0 })
    const style = computed(() => {
      let obj = {
        top: `${position.value.top}px`,
        left: `${position.value.left}px`,
      }
      return obj
    })
    const currentOptions = ref(null)
    const show = (evt: MouseEvent | ShowOptions, options?: ShowOptions) => {
      // console.log(evt instanceof Event, 'evt') //
      const targetOptions: any = evt instanceof Event ? evt : options //
      if (evt instanceof Event) {
        //@ts-ignore
        evt.top = evt.y
        //@ts-ignore
        evt.left = evt.x
      }
      const autoAdjustPlacement =
        targetOptions?.autoAdjustPlacement || props.autoAdjustPlacement
      const targetPosition = {
        top: targetOptions?.top || 0,
        left: targetOptions?.left || 0,
      }

      if (evt instanceof Event) {
        evt.preventDefault()
        targetPosition.top = targetOptions?.top ?? evt.pageY
        targetPosition.left = targetOptions?.left ?? evt.pageX
      }

      toggle(true)

      nextTick(() => {
        if (autoAdjustPlacement) {
          const el = contextmenuRef.value

          if (!el) return

          const width = el.clientWidth
          const height = el.clientHeight

          if (
            height + targetPosition.top >=
            window.innerHeight + window.scrollY
          ) {
            const targetTop = targetPosition.top - height

            if (targetTop > window.scrollY) {
              targetPosition.top = targetTop
            }
          }

          if (
            width + targetPosition.left >=
            window.innerWidth + window.scrollX
          ) {
            const targetWidth = targetPosition.left - width

            if (targetWidth > window.scrollX) {
              targetPosition.left = targetWidth
            }
          }
        }

        position.value = targetPosition
        console.log(position.value, 'testValeu') //
        // TODO: 添加回调参数
        emit('show')
      })
    }
    const hide = () => {
      currentOptions.value = null
      toggle(false)
      // // TODO: 添加回调参数
      emit('hide')
    }
    //
    const references = reactive(new Map<Element, ReferenceOptions>())
    const currentReference = ref<Element>()
    const currentReferenceOptions = computed(
      () => currentReference.value && references.get(currentReference.value),
    )
    const addReference = (el: Element, options?: AddReferenceOptions) => {
      const triggers = (() => {
        if (options?.trigger) {
          return Array.isArray(options.trigger)
            ? options.trigger
            : [options.trigger]
        }
        return DEFAULT_REFERENCE_OPTIONS.trigger
      })()

      const handler = (evt: Event) => {
        if (props.disabled) return
        currentReference.value = el
        show(evt as MouseEvent)
      }
      triggers.forEach((eventType) => {
        el.addEventListener(eventType, handler)
      })

      references.set(el, {
        triggers,
        handler,
      })
    }
    const removeReference = (el: Element) => {
      const options = references.get(el)

      if (!options) return

      options.triggers.forEach((eventType) => {
        el.removeEventListener(eventType, options.handler)
      })

      references.delete(el)
    }

    const onBodyClick = (evt: Event) => {
      // console.log(evt.target, contextmenuRef.value, currentReference.value) //
      if (
        !evt.target ||
        !contextmenuRef.value
        //  || !currentReference.value
      )
        return

      const notOutside =
        contextmenuRef.value.contains(evt.target as Node) ||
        (currentReferenceOptions.value &&
          currentReferenceOptions.value.triggers.includes('click') &&
          currentReference.value.contains(evt.target as Node))
      if (!notOutside) {
        toggle(false)
      }
    }

    // watch(props.modelValue, (value) => {
    //   if (value !== visible.value) {
    //     toggle(value);
    //   }
    // });
    watch(visible, (value) => {
      if (value) {
        document.addEventListener('click', onBodyClick)
      } else {
        document.removeEventListener('click', onBodyClick)
      }
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', onBodyClick)
    })

    provide('visible', visible)
    provide('autoAdjustPlacement', props.autoAdjustPlacement)

    provide('show', show)
    provide('hide', hide)
    expose({
      show,
      hide,
      visible,
      style,
      currentReferenceOptions,
      currentOptions,
      contextmenuRef,
      addReference,
      removeReference,
      toggle,
    }) //
    const _show = computed(() => {
      return visible.value || props.alwaysShow
    })
    const renderC = () => {
      let com = withDirectives(
        <div
          class={CLASSES.contextmenu}
          ref={contextmenuRef}
          style={style.value}
          onContextmenu={(evt) => {
            if (props.preventContextmenu) {
              evt.preventDefault()
            }

            emit('contextmenu', evt)
          }}
        >
          <ul class={CLASSES.contextmenuInner}>
            {slots.default?.({
              triggerOptions: currentReferenceOptions.value,
              options: currentOptions.value,
            })}
          </ul>
        </div>,
        [[vShow, _show.value]],
      )
      let com1 = null
      if (props.teleport && props.isTeleport) {
        com1 = <Teleport to={props.teleport}>{com}</Teleport>
      } else {
        com1 = com
      } //
      return com1
    } //
    // return {
    //   visible,
    //   style,
    //   renderC,
    //   currentReferenceOptions,
    //   currentOptions,

    //   contextmenuRef,

    //   addReference,
    //   removeReference,

    //   toggle,
    //   show,
    //   hide,
    // }
    return () => {
      return renderC()
    }
  },

  methods: {
    // renderContent() {
    //   return (
    //     <div
    //       class={CLASSES.contextmenu}
    //       ref="contextmenuRef"
    //       v-show="visible"
    //       style={this.style}
    //       onContextmenu={(evt) => {
    //         if (this.$props.preventContextmenu) {
    //           evt.preventDefault()
    //         }
    //         this.$emit('contextmenu', evt)
    //       }}
    //     >
    //       <ul class={CLASSES.contextmenuInner}>
    //         {this.$slots.default?.({
    //           triggerOptions: 'currentReferenceOptions',
    //           options: 'currentOptions',
    //         })}
    //       </ul>
    //     </div>
    //   )
    // },
  },

  // render() {
  //   if (!this.visible) return null
  //   let context = this.renderC()
  //   let com = null
  //   if (this.teleport && this.isTeleport) {
  //     com = <Teleport to={this.teleport}>{context}</Teleport>
  //   } else {
  //     com = context
  //   }
  //   return com
  //   // return this.teleport ? (
  //   //   <Teleport to={this.teleport}>{this.renderContent()}</Teleport>
  //   // ) : (
  //   //   this.renderContent()
  //   // )
  // },
})

export default Contextmenu
