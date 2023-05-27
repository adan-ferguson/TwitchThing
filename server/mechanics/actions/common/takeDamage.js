import { takeDamage } from '../../takeDamage.js'
import { takeDamageActionCalcDamage } from '../../../../game/mechanicsFns.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const damage = takeDamageActionCalcDamage(abilityInstance ?? actor, actionDef.scaling)
  return {
    damageInfo: takeDamage(combat, subject, {
      ...actionDef,
      damage
    }),
    subject: actor.uniqueID
  }
}