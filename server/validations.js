import Users from './collections/users.js'
import Joi from 'joi'

/**
 * Validate a query parameter.
 * @param val
 * @param type
 * @returns {*}
 */
export function validateParam(val, { type = 'any' }){
  try {
    return Joi.attempt(val, Joi[type]().required())
  }catch(ex){
    throw { code: 400, message: ex }
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