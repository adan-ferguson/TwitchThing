import { gainStatusEffect } from '../../mechanics/gainStatusEffect.js'

export default function(combat, actor, abilityInstance = null, actionDef = {}){
  const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  const ret = {
    subject: subject.uniqueID,
    statusEffect: actionDef.statusEffect
  }
  gainStatusEffect(combat, subject, abilityInstance, ret.statusEffect)
  return ret
}