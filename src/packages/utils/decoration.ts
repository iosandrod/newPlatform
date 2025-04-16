import { isNumber } from "lodash"

function isAsyncFunction(fn) {
    return fn && fn.constructor && fn.constructor.name === 'AsyncFunction';
}
export function useTimeout(config) {
    return function (target, key, descriptor?: any) {//
        let oldFn = descriptor.value
        let _args = null
        let number = config.number
        let _key = config.key
        if (isAsyncFunction(oldFn)) {
            if (isNumber(number) && _key !== null) {
                descriptor.value = async function (...args) {//
                    _args = args//
                    if (this.timeout[_key]) {
                        return
                    }
                    this.timeout[_key] = setTimeout(async () => {
                        this.timeout[_key] = null//
                        let result = await oldFn.apply(this, _args)//
                        return result
                    }, number)
                }
            }
        } else {
            if (isNumber(number) && _key !== null) {
                descriptor.value = function (...args) {//
                    _args = args//
                    if (this.timeout[_key]) {//
                        return
                    }
                    this.timeout[_key] = setTimeout(() => {
                        this.timeout[_key] = null//
                        oldFn.apply(this, _args)//
                    }, number)
                }//
            }
        }
    }
}