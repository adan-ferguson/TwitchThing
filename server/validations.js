export default function validations(req, res, next){

  req.validateParamExists = name => {
    if(!(name in req.body)){
      throw { code: 403, error: `Required parameter ${name} is missing.` }
    }
  }
  req.validateUserOwnsAdventurer = adventurerID => {
    if(!req.user.adventurers.find(advID => advID === adventurerID)){
      throw { code: 403, error: 'You do not own this adventurer.' }
    }
  }

  next()
}