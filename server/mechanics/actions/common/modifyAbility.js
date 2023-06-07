import { getMatchingEffectInstances } from '../../../../game/subjectFns.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const modifiedAbilities = []
  getMatchingEffectInstances(abilityInstance.parentEffect, actionDef.subjectKey)
    .forEach(ei => {
      return ei.getAbilities(actionDef.trigger, 'action').forEach(ability => {
        ability.cooldownRemaining += actionDef.modification.cooldownRemaining ?? 0
        modifiedAbilities.push({ parentEffect: ei.uniqueID })
      })
    })
  return {
    modifiedAbilities
  }
}