import { mergeOptionsObjects } from './utilFunctions.js'

export function makeActionResult(obj){
  obj = mergeOptionsObjects({
    triggeredEvents: [],
    type: null,
    data: null,
    cancelled: false,
    subject: null,
  }, obj)
  if(!obj.type){
    throw 'ActionResult missing type'
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