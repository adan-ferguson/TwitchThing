import { scaledNumberFromInstance } from '../../../../game/scaledNumber.js'
import { gainHealth } from '../../gainHealth.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const gain = Math.ceil(scaledNumberFromInstance(abilityInstance ?? actor, actionDef.scaling))
  if(gain <= 0){
    return
  }
  return gainHealth(combat, subject, gain)
}