import { damageActionCalcDamage } from '../../../../game/mechanicsFns.js'
import { dealDamage } from '../../dealDamage.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const damage = damageActionCalcDamage(abilityInstance ?? actor, actionDef.scaling)
  return {
    damageInfo: dealDamage(combat, actor, subject, {
      ...actionDef,
      damage
    }),
    subject: subject.uniqueID
  }
}