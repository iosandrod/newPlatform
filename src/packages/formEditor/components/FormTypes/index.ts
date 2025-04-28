// import _ from 'lodash'
// const importModules = import.meta.glob('./*/*.vue', { eager: true })
// const modules = {}
// _.forIn(importModules, (func, path) => {
//   modules[_.split(path, '/')[1]] = func.default
// })
// const year = 1958
// export {
//   year
// }

import inputPc from './Input/pc'
import inputMobile from './Input/mobile'
import numberPc from './Number/pc'
import numberMobile from './Number/mobile'
import radioPc from './Radio/pc'
import radioMobile from './Radio/mobile'
import selectPc from './Select/pc'
import selectMobile from './Select/mobile'
import stablePc from './Stable/pc'
import stableMobile from './Stable/mobile'
import entityPc from './Entity/pc'
import entityMobile from './Entity/mobile'
import dividerPc from './Divider/pc.vue'
import dividerMobile from './Divider/mobile.vue' //
import sformPc from './Sform/pc'
import sformMobile from './Sform/mobile'
import dformPc from './Dform/pc'
import dformMobile from './Dform/mobile' //
export const typeMap = {
  input: {
    pc: inputPc,
    mobile: inputMobile,
  },
  entity: {
    pc: entityPc,
    mobile: entityMobile,
  },
  stable: {
    pc: stablePc,
    mobile: stableMobile,
  },
  number: {
    pc: numberPc,
    mobile: numberMobile,
  },
  sform: {
    pc: sformPc,
    mobile: sformMobile,
  },
  radio: {
    pc: radioPc,
    mobile: radioMobile,
  },
  select: {
    pc: selectPc,
    mobile: selectMobile,
  },
  divider: {
    pc: dividerPc,
    mobile: dividerMobile,
  },
  dform: {
    pc: dformPc,
    mobile: dformMobile,
  },
}
export default {}
