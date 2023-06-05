import { scaledNumberFromInstance } from './scaledNumber.js'

export function damageActionCalcDamage(instance, scaling){
  let damage = Math.ceil(scaledNumberFromInstance(instance, scaling))
  damage *= instance.stacks || 1
  return damage
}

export function ignoresDefenseMatchesDamageType(mods, damageType){
  for(let mod of mods){
    if(mod === true || mod === damageType){
      return true
    }
  }
  return false
}