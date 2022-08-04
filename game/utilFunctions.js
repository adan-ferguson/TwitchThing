export function toArray(arrayOrVal){
  return Array.isArray(arrayOrVal) ? arrayOrVal : [arrayOrVal]
}

export function toDisplayName(str){
  let displayName = ''
  let prevLowerCase = false
  for(let i = 0; i < str.length; i++){
    let nextChar = str[i]
    let forceUpper = i === 0 ? true : false
    if(nextChar === nextChar.toUpperCase()){
      if(prevLowerCase){
        displayName += ' '
        forceUpper = true
      }
      prevLowerCase = false
    }else{
      prevLowerCase = true
    }
    displayName += forceUpper ? nextChar.toUpperCase() : nextChar
  }
  return displayName
}

export function roundToFixed(val, digits){
  const multi = Math.pow(10, digits)
  val *= multi
  val = Math.round(val)
  return val / multi
}

export function isObject(val){
  if (val === null){ return false}
  return ( (typeof val === 'function') || (typeof val === 'object') )
}

export function mergeOptionsObjects(currentOptions, newOptions){
  const options = { ...currentOptions }
  for(let key in newOptions){
    if(key in options){
      options[key] = newOptions[key]
    }
  }
  return options
}

export function wrap(content, options = {}){
  options = {
    elementType: 'div',
    allowHTML: false,
    classes: null,
    ...options
  }
  const el = document.createElement(options.elementType)
  if(options.allowHTML){
    if(content instanceof HTMLElement){
      el.appendChild(content)
    }else{
      el.innerHTML = content
    }
  }else{
    el.textContent = content
  }
  if(options.classes){
    el.classList.add(...toArray(options.classes))
  }
  return el
}

export function fillArray(fn, length){
  const arr = []
  for(let i = 0; i < length; i++){
    arr.push(fn(i))
  }
  return arr
}

export function wait(ms){
  return new Promise(res => {
    setTimeout(res, ms)
  })
}

export function isString(val){
  return typeof val === 'string' || val instanceof String
}