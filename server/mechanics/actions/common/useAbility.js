import { getMatchingEffectInstances } from '../../../../game/subjectFns.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  // TODO: fix
  // getMatchingEffectInstances(abilityInstance.parentEffect, actionDef.subject.key)
  //   .forEach(ei => {
  //     return ei.getAbilities(actionDef.trigger, 'action').forEach(ability => {
  //       if(ability.tryUse()){
  //         combat.addPendingTriggers([{ ability, data: {} }])
  //       }
  //     })
  //   })
}