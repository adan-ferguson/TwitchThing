import { damageActionCalcDamage } from '../../../../game/mechanicsFns.js'
import { dealDamage } from '../../dealDamage.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  let damage = damageActionCalcDamage(abilityInstance ?? actor, actionDef.scaling)
  damage = Math.ceil(damage)
  return {
    damageInfo: dealDamage(combat, actor, subject, {
      ...actionDef,
      damage
    })
  }
}