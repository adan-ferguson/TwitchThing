import { scaledNumberFromInstance } from './scaledNumber.js'

export function takeDamageActionCalcDamage(instance, scaling){
  let damage = Math.ceil(scaledNumberFromInstance(instance, scaling))
  damage *= instance.stacks || 1
  return damage
}