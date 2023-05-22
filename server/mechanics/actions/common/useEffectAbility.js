import { getMatchingEffectInstances } from '../../../../game/subjectFns.js'

export default function(combat, actor, abilityInstance = null, actionDef = {}){
  getMatchingEffectInstances(abilityInstance.parentEffect, actionDef.subject)
    .forEach(ei => {
      return ei.getAbilities(actionDef.trigger, 'action').forEach(ability => {
        if(ability.tryUse()){
          combat.addPendingTriggers([{ ability, data: {} }])
        }
      })
    })
  return []
}