import { scaledNumberFromAbilityInstance } from '../../../../game/scaledNumber.js'

export default function(scaling, abilityInstance){
  return scaledNumberFromAbilityInstance(abilityInstance, scaling)
}