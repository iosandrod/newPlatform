import _ from 'lodash'
import { nanoid } from './nanoid'
// import { typeMap } from '@ER/formEditor/components/FormTypes'
const fieldsRe = /^(buttongroup|input|textarea|number|radio|checkbox|select|time|date|rate|switch|slider|html|cascader|uploadfile|signature|region|subform|entity|dform)$/
const deepTraversal = (node, fn) => {
  fn(node)
  const nodes = node.list || node.rows || node.columns || node.children || []
  nodes.forEach((e) => {
    deepTraversal(e, fn)
  })
} //
const wrapElement = (element, fn?: any) => {
  const result = element
  deepTraversal(result, (node) => {
    if (Array.isArray(node)) return false
    if (!node.style) {
      node.style = {}
    }
    if (!node.id) {
      node.id = nanoid()
    }
    if (!node.key) {
      node.key = `${node.type}_${node.id}`
    }
    if (/^(grid|tabs|collapse|table|divider)$/.test(node.type)) {
      node.style = {
        width: '100%',
      }
    }

    if (checkIsField(node)) {
      node.style = {
        width: {
          pc: '100%',
          mobile: '100%',
        },
      }
    }
    if (/^(tabs)$/.test(node.type)) {
      node.columns = new Array(1).fill('').map((e, index) => {
        const data: any = renderFieldData('tabsCol')
        data.label = `Tab ${index + 1}`
        data.options = {}
        return data
      })
    }
    if (/^(collapse)$/.test(node.type)) {
      node.columns = new Array(1).fill('').map((e, index) => {
        const data: any = renderFieldData('collapseCol')
        data.label = `Tab ${index + 1}`
        data.options = {}
        return data
      })
    }
    fn && fn(node)
  })
  return result
}
const renderFieldData = (type) => {
  //字段数据
  const result = {
    id: nanoid(),
    type,
    label: '',
    list: [],
    style: {},
  }
  return result
}
const excludes = [
  'grid',
  'col',
  'table',
  'tr',
  'td',
  'tabs',
  'tabsCol',
  'collapse',
  'collapseCol',
  'divider',
  'inline',
]
const flatNodes = (nodes, excludes, fn?: any, excludesFn?: any) => {
  return nodes.reduce((res, node, currentIndex) => {
    if (node == null) {
      return res
    } //
    //不是field的node
    if (excludes.indexOf(node.type) === -1) {
      res.push(node)
      fn && fn(nodes, node, currentIndex)
    } else {
      excludesFn && excludesFn(nodes, node, currentIndex)
    }
    const children =
      node.list || node.rows || node.columns || node.children || []
    res = res.concat(flatNodes(children, excludes, fn, excludesFn))
    return res
  }, [])
}
const getAllFields = (store) => flatNodes(store, excludes)
const pickfields = (list) => {
  return flatNodes(list, excludes)
}
const processField = (list) => {
  return flatNodes(list, excludes, (nodes, node, currentIndex) => {
    nodes[currentIndex] = node.id
  })
}
const disassemblyData1 = (data) => {
  const result = {
    list: data.list,
    config: data.config,
    fields: processField(data.list),
    data: data.data,
    logic: data.logic,
  }
  return result
}
const combinationData1 = (data) => {
  const result = {
    list: data.list,
    config: data.config,
    data: data.data,
    fields: data.fields,
    logic: data.logic,
  }
  const fn = (nodes, node, currentIndex) => {
    const cur = _.find(data.fields, { id: node })
    if (!_.isEmpty(cur)) {
      if (cur.type === 'subform') {
        flatNodes(cur.list[0], excludes, fn)
      }
      nodes[currentIndex] = cur
    }
  }
  flatNodes(data.list, excludes, fn)
  return result
}
const combinationData2 = (list, fields) => {
  if (fields == null) {
    // debugger//
  }
  const fn = (nodes, node, currentIndex) => {
    let cur = fields.find((item) => item.id === node)
    if (!_.isEmpty(cur)) {
      nodes[currentIndex] = cur
    }
  }
  flatNodes(list, excludes, fn)
}
const repairLayout = (layout, fields) => {
  flatNodes(layout, excludes, (nodes, node, currentIndex) => {
    if (_.isString(node)) {
      if (!_.isEmpty(_.find(fields, { id: node }))) {
        nodes.splice(currentIndex, 1)
      }
    }
  })
  const temporary = []
  flatNodes(layout, excludes, null, (nodes, node, currentIndex) => {
    if (node.type === 'inline') {
      if (!node.columns.length) {
        temporary.unshift({
          nodes,
          currentIndex,
        })
      }
    }
  })
  temporary.forEach((e) => {
    e.nodes.splice(e.currentIndex, 1)
  })
} //
const disassemblyData2 = (list) => {
  flatNodes(list, excludes, (nodes, node, currentIndex) => {
    nodes[currentIndex] = node.id && node.id
  })
}
const checkIslineChildren = (node) => node.context.parent.type === 'inline'
const checkIsField = (node) => {
  let type = node.type
  // let res = fieldsRe.test(type)
  let status = true
  if (excludes.includes(type)) {
    status = false
  }
  return status //
}
const calculateAverage = (count, total = 100) => {
  const base = Number((total / count).toFixed(2))
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(base)
  }
  return result
}
const syncWidthByPlatform = (
  node,
  platform,
  syncFullplatform = false,
  value,
) => {
  // const isArray = _.isArray(node)
  // if (!isArray) {
  //   if (_.isObject(node.style.width)) {
  //     if (syncFullplatform) {
  //       node.style.width.pc = node.style.width.mobile = value + '%'
  //     } else {
  //       node.style.width[platform] = value + '%'
  //     }
  //   } else {
  //     node.style.width = value + '%'
  //   }
  // }
  // const otherNodes = isArray
  //   ? node
  //   : node.context.parent.columns.filter((e) => e !== node)
  // const averageWidths = calculateAverage(
  //   otherNodes.length,
  //   isArray ? 100 : 100 - value,
  // )
  // otherNodes.forEach((node, index) => {
  //   const isFieldWidth = _.isObject(node.style.width)
  //   if (isFieldWidth) {
  //     if (syncFullplatform) {
  //       node.style.width.pc = node.style.width.mobile =
  //         averageWidths[index] + '%'
  //     } else {
  //       node.style.width[platform] = averageWidths[index] + '%'
  //     }
  //   } else {
  //     node.style.width = averageWidths[index] + '%'
  //   }
  // })
}
const transferLabelPath = (node) =>
  `er.fields.${
    node.type === 'input'
      ? `${node.type}.${node.options.renderType - 1}`
      : `${node.type}`
  }` //
const fieldLabel = (t, node) => {
  // console.log(node,'testNode')//
  // let value = transferLabelPath(node)
  let value1 = t(transferLabelPath(node))

  return value1
}
const transferData = (lang, path, locale, options = {}) => {
  let result = ''
  if (_.isEmpty(options)) {
    result = _.get(locale[lang], path, '')
  } else {
    result = _.template(_.get(locale[lang], path, ''))(options)
  }
  return result
}
const isNull = (e) => e === '' || e === null || e === undefined
const checkIsInSubform = (node) => {
  return false
}
const getSubFormValues = (subform) =>
  subform.list.map((e) => {
    const cur = {}
    const children = []
    e.forEach((e) => {
      e.columns.forEach((e) => {
        children.push(e)
      })
    })
    children.forEach((e) => {
      cur[e.key] = e.options.defaultValue
    })
    return cur
  })
const findSubFormAllFields = (subform) => {
  const result = []
  subform.list.forEach((e) => {
    e.forEach((e) => {
      result.push(...e.columns)
    })
  })
  return result
}
export {
  syncWidthByPlatform,
  wrapElement,
  deepTraversal,
  renderFieldData,
  getAllFields,
  disassemblyData1,
  combinationData1,
  disassemblyData2,
  combinationData2,
  checkIslineChildren,
  checkIsField,
  pickfields,
  fieldLabel,
  transferData,
  transferLabelPath,
  isNull,
  repairLayout,
  checkIsInSubform,
  getSubFormValues,
  findSubFormAllFields,
  processField,
}
