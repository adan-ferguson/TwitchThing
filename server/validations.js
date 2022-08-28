import { isObject } from '../game/utilFunctions.js'
import Users from './collections/users.js'

export function validateParam(val, options){

  options = isObject(options) ? options : {}
  options = {
    required: true,
    type: null,
    validationFn: null,
    ...options
  }
  if(val === undefined){
    if(options.required){
      throw { code: 400, message:  'Required parameter is missing.' }
    }
  }else{
    validateType()
  }

  if(options.validationFn && !options.validationFn(val)){
    throw { code: 400, message:  'Validation function failed.' }
  }

  return val

  function validateType(){
    const type = options.type

    let err = false
    if(type === 'array' && !Array.isArray(val)){
      err = true
    }else if(type === 'integer'){
      val = parseInt(val)
      if(!Number.isInteger(val)){
        err = true
      }
    }else if(isObject(type)){
      Object.keys(type).find(key => validateParam(val[key], type[key]))
    }

    if(err){
      throw { code: 400, message: `Parameter ${val} is invalid type, expected ${type}.` }
    }
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