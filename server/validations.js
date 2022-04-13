export default function validations(req, res, next){

  req.validateParam = (name, options = {} ) => {
    options = {
      required: true,
      type: null,
      ...options
    }
    if(!(name in req.body)){
      if(options.required){
        throw { code: 403, error: `Required parameter ${name} is missing.` }
      }
      return null
    }
    if(options.type){
      validateType(req.body[name], options.type)
    }
    return req.body[name]
  }

  next()
}

function validateType(val, type){
  // TODO: make better
  if(typeof val !== type){
    throw { code: 403, error: `Parameter ${name} is invalid type, expected ${type}.` }
  }
}