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

export function mergeElementOptions(currentOptions, newOptions){
  const options = { ...currentOptions }
  for(let key in newOptions){
    if(key in options){
      options[key] = newOptions[key]
    }
  }
  return options
}

export function wrap(elementName, content, html = false){
  const el = document.createElement(elementName)
  if(html){
    el.innerHTML = content
  }else{
    el.textContent = content
  }
  const parentEl = document.createElement('div')
  parentEl.appendChild(el)
  return parentEl.innerHTML
}