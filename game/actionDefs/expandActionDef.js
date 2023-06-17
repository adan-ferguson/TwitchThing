import Actions from './combined.js'
import { cleanupObject, deepClone, mergeOptionsObjects } from '../utilFunctions.js'

export function expandActionDef(actionDef){
  const ret = {}
  const actionKey = Object.keys(actionDef)[0]
  if(!Actions[actionKey]){
    throw 'No more implicit actions'
  }
  const defaults = deepClone(Actions[actionKey].def)
  ret[actionKey] = cleanupObject(mergeOptionsObjects(defaults, actionDef[actionKey]))
  return ret
}