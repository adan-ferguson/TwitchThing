import { isObject } from '../game/utilFunctions.js'
import Users from './collections/users.js'
import _ from 'lodash'

export function validateParam(val, options){
  try {
    validateValue(val, options)
  }catch(ex){
    throw { code: 400, message: ex }
  }
  return val
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

  options = isObject(options) ? options : {}
  options = {
    required: true,
    type: null,
    arrayOf: null,
    ...options
  }

  if(val === undefined){
    if(options.required){
      throw 'Required parameter is missing.'
    }
  }else if(options.arrayOf){
    options.type = 'array'
  }

  if(_.isArray(options.type)){
    if(options.type.includes(val)){
      throw `Expected one of "${options.type}" but did not get one.`
    }
  }else if(options.type === 'array' && !_.isArray(val)){
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
    Object.keys(options.type).forEach(key => validateParam(val[key], options.type[key]))
  }
}

export function requireRegisteredUser(req){
  if(!req.user){
    throw { code: 401, message: 'Not logged in', redirect: '/' }
  }
  if(!Users.isSetupComplete(req.user)){
    throw { code: 401, message: 'User setup not complete', redirect: '/user/newuser' }
  }
}