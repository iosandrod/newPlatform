import { inject } from 'vue'
const _bem = (
  namespace,
  block,
  blockSuffix,
  element,
  modifier
) => {
  let cls = `${namespace}-${block}`
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}
const statePrefix = 'is-'
export const useNamespace = (block, Namespace?: any) => {
  const defaultNamespace = Namespace || inject<any>('Everright',{})?.state?.Namespace||'formEditor'
  const namespace = `Everright-${defaultNamespace}`
  const b = (blockSuffix = '') =>
    _bem(namespace, block, blockSuffix, '', '')
  const e = (element) =>
    element ? _bem(namespace, block, '', element, '') : ''
  const is = (name, ...args) => {
    const state = args.length >= 1 ? args[0] : true
    return name && state ? `${statePrefix}${name}` : ''
  }
  return {
    namespace,
    b,
    e,
    is
  }
}
