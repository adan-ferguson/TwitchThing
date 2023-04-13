import { expandStatusEffectsDef } from '../../../game/statusEffectsData.js'

export default function(combat, attacker, effect = null, actionDef = {}){
  // const actor = sourceEffect.owner
  // const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  // const resultObj = {
  //   type: 'gainEffect',
  //   triggeredEvents: [],
  //   subject: subject.uniqueID
  // }
  //
  // if(subject !== actor){
  //   resultObj.triggeredEvents.push(...triggerEvent(combat, subject, 'targeted'))
  //   if(resultObj.triggeredEvents.at(-1)?.cancelled){
  //     resultObj.cancelled = true
  //     return makeActionResult(resultObj)
  //   }
  // }
  //
  // resultObj.data = addStatusEffect(combat, sourceEffect, subject, actionDef.effect)
  // return makeActionResult(resultObj)
}

// /**
//  * @param combat
//  * @param sourceEffect
//  * @param subject
//  * @param def
//  */
// export function addStatusEffect(combat, sourceEffect, subject, def){
//   const data = expandStatusEffectsDef(sourceEffect, def)
//   data.sourceEffectId = sourceEffect.effectId
//   subject.statusEffectsData.add(data)
//   return data
// }