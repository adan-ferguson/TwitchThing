import { isObject } from '../game/utilFunctions.js'

export default function validations(req, res, next){

  req.validateParam = (name, options = {} ) => {
    const error = validateObjectValue(req.body, name, options)
    if(error){
      throw { code: 403, error }
    }
    return req.body[name]
  }

  next()
}

export function validateObjectValue(obj, name, options){

  options = isObject(options) ? options : {}
  options = {
    required: true,
    type: null,
    ...options
  }
  const val = obj[name]
  if(val === undefined){
    if(options.required){
      return `Required parameter ${name} is missing.`
    }
  }else{
    return validateType()
  }

  function validateType(){
    const type = options.type
    if(type === 'array' && !Array.isArray(val)){
      return `Parameter ${name} is invalid type, expected ${type}.`
    }else if(isObject(type)){
      return Object.keys(type).find(key => validateObjectValue(val, key, type[key]))
    }
  }
}