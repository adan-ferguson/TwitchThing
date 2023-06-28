import Actions from './combined.js'
import { cleanupObject, deepClone, mergeOptionsObjects } from '../utilFunctions.js'

export function expandActionDef(actionDef, includeKey = true){
  const ret = {}
  const actionKey = Object.keys(actionDef)[0]
  if(!Actions[actionKey]){
    return null
  }
  const defaults = deepClone(Actions[actionKey].def)
  ret[actionKey] = cleanupObject(mergeOptionsObjects(defaults, actionDef[actionKey]))
  return includeKey ? ret : ret[actionKey]
}