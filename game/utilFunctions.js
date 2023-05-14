import { v4 } from 'uuid'
import _ from 'lodash'
import Joi from 'joi'

export function arrayize(arrayOrVal){
  return Array.isArray(arrayOrVal) ? arrayOrVal : [arrayOrVal]
}

export function arrayToObject(array, key){
  const obj = {}
  array.forEach(i => {
    obj[i[key]] = i
  })
  return obj
}

export function toDisplayName(str){
  if(!str){
    return ''
  }
  let displayName = ''
  let prevLowerCase = false
  let forceNextUpper = false
  for(let i = 0; i < str.length; i++){
    let nextChar = str[i]
    let forceUpper = i === 0 ? true : forceNextUpper
    forceNextUpper = false
    if(nextChar === nextChar.toUpperCase()){
      if(nextChar.toUpperCase() === nextChar.toLowerCase()){
        forceNextUpper = true
      }else if(prevLowerCase){
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

export function roundToFixed(val, digits, padEnd = false){
  const multi = Math.pow(10, digits)
  val *= multi
  val = Math.round(val)
  val /= multi

  if(padEnd){
    const singles = Math.floor(val)
    if(singles !== val){
      val = val.toString().padEnd(1 + singles.toString().length + digits, '0')
    }
  }

  return val
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

export function wrapText(text, options = {}){
  return makeEl({
    text,
    ...options
  })
}

export function wrapContent(content, options = {}){
  return makeEl({
    content,
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

export function uniqueID(){
  return v4()
}

export function minMax(min, val, max){
  return Math.max(min, Math.min(max, val))
}

export function toNumberOfDigits(val, digits){
  val = Math.ceil(val)
  if(val < Math.pow(10, digits)){
    return val
  }
  val = val + ''
  const divisor = Math.pow(10, val.length - digits)
  return Math.ceil(val / divisor) * divisor
}

export function toTimerFormat(ms){
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)

  const minuteStr = minutes ? minutes : '0'
  let secondsStr = seconds % 60
  if(secondsStr === 0){
    secondsStr = '00'
  }else if(secondsStr < 10){
    secondsStr = '0' + secondsStr
  }

  return minuteStr + ':' + secondsStr
}

export function suffixedNumber(val, digits = 5){
  // TODO: make this for real
  // if(val > 10000000){
  //   return Math.round(val / 1000000) + 'M'
  // }
  // return val + ''
  return val.toLocaleString()
}

/**
 * Cleanup common issues with objects.
 * 1) Numbers are rounded to nearest 0.0001 (fix floating point nonsense)
 * @param obj
 */
export function cleanupObject(obj){
  const newObj = _.isArray(obj) ? [] : {}
  for(let key in obj){
    if(_.isNumber(obj[key])){
      newObj[key] = roundToFixed(obj[key], 4)
    }else if(_.isObject(obj[key])){
      newObj[key] = cleanupObject(obj[key])
    }else{
      newObj[key] = obj[key]
    }
  }
  return newObj
}

export function isolate(arrayOfObjs, propName){
  const arr = []
  arrayOfObjs.forEach(obj => {
    if(obj[propName]){
      arr.push(obj[propName])
    }
  })
  return arr
}

export function deepClone(obj){
  return JSON.parse(JSON.stringify(obj))
}

export function keyedObject(keyList, defaultValue = null){
  return keyList.reduce((val, key) => { return { ...val, [key]: defaultValue } }, {})
}