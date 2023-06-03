import { msToS } from '../../../../../game/utilFunctions.js'

export function derivedModifyAbilityDescription(def, abilityInstance){
  return [`Refresh your active cooldowns by ${msToS(def.modification.cooldownRemaining * -1)}s.`]
}