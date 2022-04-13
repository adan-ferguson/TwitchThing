export default function validations(req, res, next){

  req.validateParam = (name, options = {} ) => {
    options = {
      required: true,
      type: null,
      ...options
    }
    const val = req.body[name]
    if(val === undefined){
      if(options.required){
        throw { code: 403, error: `Required parameter ${name} is missing.` }
      }
      return null
    }
    validateType()
    return val

    function validateType(){
      // TODO: make better
      const type = options.type
      if(type === 'array' && !Array.isArray(val)){
        throw { code: 403, error: `Parameter ${name} is invalid type, expected ${type}.` }
      }
    }
  }

  next()
}