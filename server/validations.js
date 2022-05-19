import { isObject } from '../game/utilFunctions.js'

export function validateParam(val, options){

  options = isObject(options) ? options : {}
  options = {
    required: true,
    type: null,
    ...options
  }
  if(val === undefined){
    if(options.required){
      throw { code: 400, message:  `Required parameter ${name} is missing.` }
    }
  }else{
    return validateType()
  }

  function validateType(){
    const type = options.type
    if(type === 'array' && !Array.isArray(val)){
      throw { code: 400, message: `Parameter ${name} is invalid type, expected ${type}.` }
    }else if(isObject(type)){
      Object.keys(type).find(key => validateParam(val[key], type[key]))
    }
  }
}