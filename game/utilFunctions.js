import { v4 } from 'uuid'

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

export function roundToNearestIntervalOf(val, interval){
  const newVal = interval * Math.round(val / interval)
  return interval < 1 ? roundToFixed(newVal, Math.ceil(-Math.log10(interval))) : newVal
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

export function wrapContent(content, options = {}){
  if(options.allowHTML){
    return makeEl({
      content: content,
      ...options
    })
  }
  return makeEl({
    text: content,
    ...options
  })
}

export function makeEl(options = {}){

  options = {
    elementType: 'div',
    text: null,
    content: null,
    class: null,
    ...options
  }

  const el = document.createElement(options.elementType)
  if (options.content){
    if (options.content instanceof HTMLElement){
      el.appendChild(options.content)
    } else {
      el.innerHTML = options.content
    }
  } else if (options.text){
    el.textContent = options.text
  }

  if (options.class){
    const classArray = Array.isArray(options.class) ? options.class : options.class.split(' ')
    el.classList.add(...classArray)
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

export function wait(ms = 0){
  return new Promise(res => {
    setTimeout(res, ms)
  })
}

export function isString(val){
  return typeof val === 'string' || val instanceof String
}

export function uuid(){
  return v4()
}