import Users from './collections/users.js'
import Joi from 'joi'
import _ from 'lodash'

/**
 * Validate a query parameter.
 * @param val
 * @param type
 * @param required
 * @returns {*}
 */
export function validateParam(val, type = 'any', required = true){
  try {
    type = _.isString(type) ? type : type.type
    if(!required){
      return Joi.attempt(val, Joi[type]())
    }
    return Joi.attempt(val, Joi[type]().required())
  }catch(ex){
    throw { code: 400, message: ex }
  }
}

export function requireRegisteredUser(req){
  if(!req.user){
    throw { code: 401, message: 'Not logged in', redirect: '/', output: false, }
  }
  if(!Users.isSetupComplete(req.user)){
    throw { code: 401, message: 'User setup not complete', redirect: '/user/newuser' }
  }
}