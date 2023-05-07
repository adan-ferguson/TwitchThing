import Actions from './combined.js'
import { cleanupObject, mergeOptionsObjects } from '../utilFunctions.js'

export function expandActionDef(actionDef){
  const ret = {}
  for(let actionKey in actionDef){
    if(!Actions[actionKey]){
      throw 'Invalid action key: ' + actionKey
    }
    const defaults = { actionId: null, ...Actions[actionKey].def }
    ret[actionKey] = cleanupObject(mergeOptionsObjects(defaults, actionDef[actionKey]))
  }
  return ret
}