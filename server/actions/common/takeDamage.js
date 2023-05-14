import { takeDamage } from '../../mechanics/takeDamage.js'
import { scaledNumberFromInstance } from '../../../game/scaledNumber.js'

export default function(combat, actor, abilityInstance = null, actionDef = {}){
  const damage = Math.ceil(scaledNumberFromInstance(abilityInstance ?? actor, actionDef.scaling))
  return {
    damageInfo: takeDamage(combat, actor, {
      ...actionDef,
      damage
    }),
    subject: actor.uniqueID
  }
}