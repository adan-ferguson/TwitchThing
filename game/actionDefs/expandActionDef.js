import { all } from './combined.js'
import { cleanupObject, mergeOptionsObjects } from '../utilFunctions.js'

export function expandActionDef(actionDef){

  if(!actionDef.type){
    throw 'actionDef missing a type'
  }

  if(!all[actionDef.type]){
    throw 'Invalid action type: ' + actionDef.type
  }

  const defaults = all[actionDef.type]

  return cleanupObject(
    mergeOptionsObjects(defaults, {
      ...actionDef,
      type: actionDef.type
    })
  )
}