import { getMatchingEffectInstances } from '../subjectFns.js'

export function shieldBashCalcStun(abilityInstance, actionDef){
  const attached = getMatchingEffectInstances(abilityInstance.parentEffect, 'attached')[0]
  const block = attached?.stats.get('block').value
  if(!block){
    return null
  }
  return actionDef.stunMin * (1 + block * 2)
}