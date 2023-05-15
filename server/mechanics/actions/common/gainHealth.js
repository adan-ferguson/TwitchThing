import { scaledNumberFromAbilityInstance } from '../../../../game/scaledNumber.js'
import { gainHealth } from '../../gainHealth.js'

export default function(combat, actor, abilityInstance = null, actionDef = {}){
  const gain = Math.ceil(scaledNumberFromAbilityInstance(abilityInstance, actionDef.scaling))
  if(gain <= 0){
    return
  }
  return gainHealth(combat, actor, gain)
}