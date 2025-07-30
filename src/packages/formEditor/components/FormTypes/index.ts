// _ from 'lodash'
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
import codePc from './Code/pc'
import codeMobile from './Code/mobile'
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
import sformPc from './Sform/pc' //
import sformMobile from './Sform/mobile'
import dformPc from './Dform/pc'
import dformMobile from './Dform/mobile' //
import stringPc from './String/pc'
import stringMobile from './String/mobile'
import buttonGroupPc from './ButtonGroup/pc'
import buttonGroupMobile from './ButtonGroup/mobile' //
import checkboxPc from './Checkbox/pc'
import checkboxMobile from './Checkbox/mobile'
import imagePc from './Image/pc'
import imageMobile from './Image/mobile' //
import baseinfoPc from './Baseinfo/pc'
import baseinfoMobile from './Baseinfo/mobile' //
import colorPc from './Color/pc'
import colorMobile from './Color/mobile'
import ganttPc from './Gantt/pc'
import ganttMobile from './Gantt/mobile' //
import flowPc from './Flow/pc'
import flowMobile from './Flow/mobile' //
export const typeMap = {
  image: {
    pc: imagePc,
    mobile: imageMobile,
  },
  buttongroup: {
    pc: buttonGroupPc,
    mobile: buttonGroupMobile, //
  },
  string: {
    pc: stringPc,
    mobile: stringMobile, //
  },
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
  code: {
    pc: codePc,
    mobile: codeMobile,
  },
  time: {
    pc: inputPc,
    mobile: inputMobile,
  },
  date: {
    pc: inputPc,
    mobile: inputMobile,
  },
  datetime: {
    pc: inputPc,
    mobile: inputMobile,
  }, //
  checkbox: {
    pc: checkboxPc,
    mobile: checkboxMobile,
  },
  boolean: {
    pc: checkboxPc,
    mobile: checkboxMobile,
  },
  baseinfo: {
    pc: baseinfoPc,
    mobile: baseinfoMobile,
  },
  color: {
    pc: colorPc,
    mobile: colorMobile, //
  },
  gantt: {
    pc: ganttPc,
    mobile: ganttMobile, //
  },
  flow: {
    pc: flowPc,
    mobile: flowMobile,
  },
}
export default {}
