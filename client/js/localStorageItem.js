const handler = {
  get(obj, prop){
    if(prop in obj){
      return obj[prop]
    }
    if(prop in obj.defaults){
      return localStorage.getItem(obj.storageKey + '-' + prop) ?? obj.defaults[prop]
    }
    throw 'Invalid prop ' + prop
  },
  set(obj, prop, val){
    if(prop in obj.defaults){
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