const BOOL_TRUE = '__BOOL__TRUE__'
const BOOL_FALSE = '__BOOL__FALSE__'

const handler = {
  get(obj, prop){
    if(prop in obj){
      return obj[prop]
    }
    if(prop in obj.defaults){
      const val = localStorage.getItem(obj.storageKey + '-' + prop) ?? obj.defaults[prop]
      if(val === BOOL_TRUE){
        return true
      }else if(val === BOOL_FALSE){
        return false
      }
      return val
    }
    throw 'Invalid prop ' + prop
  },
  set(obj, prop, val){
    if(prop in obj.defaults){
      if(val === true){
        val = BOOL_TRUE
      }else if(val === false){
        val = BOOL_FALSE
      }
      localStorage.setItem(obj.storageKey + '-' + prop, val)
      return true
    }
    throw 'Invalid prop ' + prop
  },
}

export function localStorageItem(storageKey, defaults){
  const p = new Proxy({
    storageKey,
    defaults,
    setMulti(obj){
      for(let key in obj){
        if(key in defaults){
          p[key] = obj[key]
        }
      }
    }
  }, handler)
  return p
}