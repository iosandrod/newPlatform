import { isNumber } from 'lodash'

function isAsyncFunction(fn) {
  return fn && fn.constructor && fn.constructor.name === 'AsyncFunction'
}
export function useTimeout(config) {
  return function (target, key, descriptor?: any) {
    let oldFn = descriptor.value
    let _args = null
    let number = config.number
    let _key = config.key
    if (isAsyncFunction(oldFn)) {
      if (isNumber(number) && _key !== null) {
        descriptor.value = async function (...args) {
          //
          _args = args //
          if (this.timeout[_key]) {
            return
          }
          this.timeout[_key] = setTimeout(async () => {
            this.timeout[_key] = null //
            let result = await oldFn.apply(this, _args) //
            return result
          }, number)
        }
      }
    } else {
      if (isNumber(number) && _key !== null) {
        descriptor.value = function (...args) {
          return new Promise((resolve, reject) => {
            _args = args ////
            if (this.timeout[_key] != null) {
              return
            }
            this.timeout[_key] = setTimeout(() => {
              console.log('我执行到这里了') //
              try {
                this.timeout[_key] = null //
                let _value = oldFn.apply(this, _args) //
                resolve(_value) //
              } catch (error) {
                reject(error) //
              }
            }, number)
          })
        } //
      }
    }
  }
}

function isPromise(val: any): val is Promise<any> {
  return (
    !!val &&
    typeof val === 'object' &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
export function cacheValue(config?: Function) {
  let cacheReturnValue = function cacheReturnValue(
    target?: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value
    if (isAsyncFunction(originalMethod)) {
      descriptor.value = async function (...args: any[]) {
        //@ts-ignore
        let cache = this.cacheTemplateProps
        let id = args[0] || ''
        if (typeof config == 'function') {
          id = await config.apply(this, args)
        }
        let _key = `${propertyKey}--${id}` //
        if (typeof config === 'function') {
          let _key1 = await config.apply(this, args)
          if (typeof _key1 === 'string') {
            _key = _key1
          }
        }
        let _value = cache[_key]
        if (_value != null) {
          //
          return _value //
        }
        let result = originalMethod.apply(this, args)
        if (isPromise(result)) {
          result = await result
        }
        cache[_key] = result //
        return result //
      }
    } else {
      descriptor.value = function (...args: any[]) {
        //@ts-ignore
        let cache = this.cacheTemplateProps //
        let id = args[0] || '' //
        if (typeof config == 'function') {
          id = config.apply(this, args) //
        }
        let _key = `${propertyKey}--${id}`
        if (typeof config === 'function') {
          let _key1 = config.apply(this, args) //
          if (typeof _key1 === 'string') {
            _key = _key1
          }
        }
        let _value = cache[_key]
        if (_value != null) {
          return _value //
        }
        let result = originalMethod.apply(this, args)
        cache[_key] = result ////
        return result //
      } //
    }
  }
  return cacheReturnValue as any
}

export function useRunAfter(config?: any) {
  return function (target, key, descriptor?: any) {
    let oldFn = descriptor.value
    if (isAsyncFunction(oldFn)) {
      descriptor.value = async function (...args) {
        let result = await oldFn.apply(this, args)
        await this.runAfter({
          methodName: key, //
        })
        return result
      }
    } else {
      descriptor.value = function (...args) {
        let _this = this
        let result = oldFn.apply(this, args)
        if (isPromise(result)) {
          result.then((res) => {
            _this.runAfter({
              methodName: key, //
            })
          })
        }
        return result
      }
    }
  }
}

export function useRunBefore(config?: any) {
  return function (target, key, descriptor?: any) {
    let oldFn = descriptor.value
    if (isAsyncFunction(oldFn)) {
    } else {
    }
  }
}
