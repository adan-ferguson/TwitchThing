import { isObject } from '../game/utilFunctions.js'
import Users from './collections/users.js'
import _ from 'lodash'

/**
 * Validate a query parameter.
 * @param val
 * @param options
 * @deprecated Use validateValue or validateObject instead
 * @returns {*}
 */
export function validateParam(val, options){
  try {
    validateValue(val, { required: true, ...options })
  }catch(ex){
    throw { code: 400, message: ex }
  }
  return val
}

export function validateBody(body, validation){
  try {
    validateObject(body, validation)
  }catch(ex){
    throw { code: 400, message: ex }
  }
}

export function validateObject(obj, validation){
  for(let key in obj){
    if(!validation[key]){
      throw 'Invalid key: ' + key
    }
  }
  for(let key in validation){
    try {
      validateValue(obj[key], validation[key])
    }catch(msg){
      throw `Invalid value for key "${key}": ${msg}`
    }
  }
}

export function validateValue(val, options){

  options = isObject(options) ? options : { type: options }
  options = {
    required: false,
    type: null,
    arrayOf: null,
    ...options
  }

  if(val === undefined){
    if(options.required){
      throw 'Required parameter is missing.'
    }
    return val
  }else if(options.arrayOf){
    options.type = 'array'
  }

  if(_.isArray(options.type)){
    if(!options.type.includes(val)){
      throw `Expected one of "${options.type}" but did not get one.`
    }
  }else if(options.type === 'array'){
    if(!_.isArray(val)){
      throw 'Expected array value but did not get one.'
    }
    if(options.arrayOf){
      val.forEach(v => validateValue(v, options.arrayOf))
    }
  }else if(options.type === 'integer'){
    if(!Number.isInteger(val)){
      throw 'Expected integer value but did not get one.'
    }
  }else if(isObject(options.type)){
    if(!isObject(val)){
      throw 'Expected object but did not get one.'
    }
    validateObject(val, options.type)
  }else if(options.type === 'boolean'){
    if('boolean' !== typeof val){
      throw 'Expected boolean value but did not get one.'
    }
  }else if(options.type === 'object'){
    if(options.validKeys){
      for(let key in val){
        if(!options.validKeys.includes(key)){
          throw 'Key was not one of the validKeys'
        }
      }
    }
    if(options.validValue){
      for(let key in val){
        validateValue(val[key], options.validValue)
      }
    }
  }else if(options.type === 'string'){
    if(typeof val !== 'string'){
      throw 'Expected string value but did not get one.'
    }
  }else{
    throw 'Invalid validation.'
  }

  return val
}

export function requireRegisteredUser(req){
  if(!req.user){
    throw { code: 401, message: 'Not logged in', redirect: '/' }
  }
  if(!Users.isSetupComplete(req.user)){
    throw { code: 401, message: 'User setup not complete', redirect: '/user/newuser' }
  }
}