import Actions from './combined.js'
import { cleanupObject, mergeOptionsObjects } from '../utilFunctions.js'

export function expandActionDef(actionDef){

  if(!actionDef.type){
    throw 'actionDef missing a type'
  }

  if(!Actions[actionDef.type]){
    throw 'Invalid action type: ' + actionDef.type
  }

  const defaults = Actions[actionDef.type].def

  return {
    ...cleanupObject(mergeOptionsObjects(defaults, actionDef)),
    type: actionDef.type
  }
}