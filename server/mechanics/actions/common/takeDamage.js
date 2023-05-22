import { takeDamage } from '../../takeDamage.js'
import { takeDamageActionCalcDamage } from '../../../../game/mechanicsFns.js'

export default function(combat, actor, abilityInstance = null, actionDef = {}){
  const damage = takeDamageActionCalcDamage(abilityInstance ?? actor, actionDef.scaling)
  return {
    damageInfo: takeDamage(combat, actor, {
      ...actionDef,
      damage
    }),
    subject: actor.uniqueID
  }
}