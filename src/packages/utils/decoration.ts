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
          let _now = this.timeout[`${key}__now`]
          if (_now == true) {
            this.timeout[`${key}__now`] = false //
            if (this.timeout[_key]) {
              clearTimeout(this.timeout[_key])
              this.timeout[_key] = null
            }
            let _value = oldFn.apply(this, _args)
            return _value
          }
          if (this.timeout[_key] != null) {
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
            let _now = this.timeout[`${key}__now`]
            if (_now == true) {
              this.timeout[`${key}__now`] = false //
              if (this.timeout[_key]) {
                //
                clearTimeout(this.timeout[_key])
                this.timeout[_key] = null
              }
              let _value = oldFn.apply(this, _args)
              resolve(_value)
              return
            }
            if (this.timeout[_key] != null) {
              return
            }
            this.timeout[_key] = setTimeout(() => {
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

export function useOnce(config?: any) {
  return function (target, key, descriptor?: any) {
    let oldFn = descriptor.value
    if (isAsyncFunction(oldFn)) {
      descriptor.value = async function (...args) {
        let once = this._once || {}
        if (once[key] == true) {
          let resKey = `${key}--result`
          let res = once[resKey]
          return res //
        }
        let result = await oldFn.apply(this, args)
        once[key] = true //
        return result
      }
    } else {
      descriptor.value = function (...args) {
        let once = this._once || {}
        if (once[key] == true) {
          let resKey = `${key}--result`
          let res = once[resKey]
          return res
        }
        let result = oldFn.apply(this, args) //
        once[key] = true //
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

export function useEmit(config) {}

export function useHooks(config?: Function): any {
  //
  return function hookable(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value

    descriptor.value = async function (...args: any[]) {
      // 从实例的 hooksMetaData 上读取中间件
      let middlewares: any[] = this.hooksMetaData?.[propertyKey] || [] //

      let ctx = { instance: this, args } //
      let _config = config //
      if (typeof _config === 'function') {
        let config1 = _config(ctx) //
        ctx = { ...ctx, ...config1 } //
      }
      let _args = ctx.args
      let arg0 = _args[0]
      if (typeof arg0 === 'object') {
        ctx = { ...arg0, ...ctx } //
      }
      let index = -1 //
      async function dispatch(i: number): Promise<any> {
        if (i <= index) {
          throw new Error('next() called multiple times')
        }
        index = i
        const fn = middlewares[i]
        if (fn) {
          ////
          return fn.call(ctx.instance, ctx, () => dispatch(i + 1))
        }
        // 所有中间件执行完，调用原方法
        return original.apply(ctx.instance, ctx.args)
      }
      return dispatch(0)
    }

    return descriptor
  }
}

export function useDelay(config?: { delay?: number }): any {
  const delay = config?.delay ?? 200

  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    // 参数缓存
    let argsQueue: any[] = []
    let timer: NodeJS.Timeout | null = null
    if (isAsyncFunction(originalMethod)) {
      descriptor.value = async function (...args: any[]) {
        return new Promise(async (resolve, reject) => {
          argsQueue.push(args) // 缓存每一次调用的参数

          if (timer) {
            clearTimeout(timer) // 重置延迟
          }

          timer = setTimeout(async () => {
            const queuedArgs = argsQueue.slice() // 拷贝数组
            argsQueue = [] // 清空缓存

            // 调用原函数，传入缓存数组
            let _res = await originalMethod.call(this, queuedArgs)
            resolve(_res) //
          }, delay)
        })
      }
    } else {
      descriptor.value = function (...args: any[]) {
        argsQueue.push(args) // 缓存每一次调用的参数

        if (timer) {
          clearTimeout(timer) // 重置延迟
        }

        timer = setTimeout(() => {
          const queuedArgs = argsQueue.slice() // 拷贝数组
          argsQueue = [] // 清空缓存

          // 调用原函数，传入缓存数组
          originalMethod.call(this, queuedArgs)
        }, delay)
      }
    }
    return descriptor
  }
}
