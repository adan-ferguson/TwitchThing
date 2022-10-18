import { mergeOptionsObjects } from './utilFunctions.js'

export function makeActionResult(obj){
  obj = mergeOptionsObjects({
    triggeredEvents: [],
    type: null,
    data: null,
    subject: null,
  }, obj)
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
  return obj
}

export function validateActionResult(obj){
  makeActionResult(obj)
  return true
}