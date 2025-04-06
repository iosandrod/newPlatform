import { computed, inject, reactive } from 'vue'
import _ from 'lodash'
import utils from '@ER/utils'
export const useTarget = () => {
  const { state, setSelection, props } = inject('Everright') as any
  const formIns: any = inject('formIns')
  const type = computed(() => state.selected?.type)
  const col = computed(() => state.selected?.context?.col ?? null)

  const isSelectRoot = computed(() => state.selected === state.config)
  const isSelectAnyElement = computed(() => !isSelectRoot.value)
  const isPc = computed(() => state.platform === 'pc')
  const isEditModel = computed(() => {
    let value = /^(edit|config)$/.test(state.mode)
    let isDesign = formIns.isDesign
    return value && isDesign
  })//

  const checkTypeBySelected = (nodes: string[], propType?: any) => {
    if (!state.selected) return false
    const fn = props.checkPropsBySelected?.(state.selected, propType)
    return fn !== undefined ? fn : nodes.includes(type.value)
  }

  const createTypeChecker = (nodes: string[]) => computed(() => checkTypeBySelected(nodes))

  return ({
    state,
    setSelection,
    type,
    col,
    selection: computed(() => state.selected),
    target: computed(() => state.selected),
    isSelectAnyElement,
    isSelectRoot,
    isPc,
    isEditModel,
    isSelectField: computed(() => utils.checkIsField(state.selected)),
    isSelectGrid: createTypeChecker(['grid']),
    isSelectTabs: createTypeChecker(['tabs']),
    isSelectCollapse: createTypeChecker(['collapse']),
    isSelectTable: createTypeChecker(['table']),
    isSelectSubform: createTypeChecker(['subform']),
    checkTypeBySelected
  })
}
