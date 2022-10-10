import { mergeOptionsObjects } from './utilFunctions.js'

export function makeActionResult(obj){
  obj = mergeOptionsObjects({
    triggeredEvents: [],
    type: null,
    data: null,
    subject: null,
  }, obj)
  validateActionResult(obj)
  return obj
}

export function validateActionResult(obj){
  if(!obj.type){
    throw 'ActionResult missing type'
  }
  if(!obj.data){
    throw 'ActionResult missing data'
  }
  if(!obj.subject){
    throw 'ActionResult missing subject'
  }
  obj.triggeredEvents.forEach(event => {
    event.results.forEach(validateActionResult)
  })
}