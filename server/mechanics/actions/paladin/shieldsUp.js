import { gainBlockBarrier } from '../../gainStatusEffect.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  gainBlockBarrier(combat, actor, actionDef.multiplier)
}