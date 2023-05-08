import { scaledNumberFromAbilityInstance } from '../../../game/scaledNumber.js'

export default function(combat, actor, abilityInstance = null, actionDef = {}){
  const gain = Math.ceil(scaledNumberFromAbilityInstance(abilityInstance, actionDef.scaling))
  if(gain <= 0){
    return
  }
  const hpBefore = actor.hp
  actor.hp += gain
  return {
    subject: actor.uniqueID,
    healthGained: actor.hp - hpBefore
  }
}