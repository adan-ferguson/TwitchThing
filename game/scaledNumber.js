import AbilityInstance from './abilityInstance.js'
import { getMatchingEffectInstances } from './subjectFns.js'

const fighterFns = fighterInstance => {
  return {
    hpMax: val => val * fighterInstance.hpMax,
    hpMissing:  val => val * (fighterInstance.hpMax - fighterInstance.hp),
    hp: val => val * fighterInstance.hp,
    magicPower: val => val * fighterInstance.magicPower,
    physPower: val => val * fighterInstance.physPower,
  }
}

export function scaledNumberFromFighterInstance(fighterInstance, scalingOptions){
  return scaledNumber(scalingOptions, fighterFns(fighterInstance))
}

export function scaledNumberFromAbilityInstance(abilityInstance, scalingOptions){
  const fighterInstance = abilityInstance.fighterInstance
  return scaledNumber(scalingOptions, {
    ...fighterFns(fighterInstance),
    magicPower: val => val * abilityInstance.totalStats.get('magicPower').value,
    physPower: val => val * abilityInstance.totalStats.get('physPower').value,
  })
}

export function scaledNumberFromInstance(instance, scalingOptions){
  return instance instanceof AbilityInstance ?
    scaledNumberFromAbilityInstance(instance, scalingOptions) :
    scaledNumberFromFighterInstance(instance, scalingOptions)
}

function scaledNumber(scalingOptions, scalingFns){
  let number = 0
  for(let key in scalingOptions){
    number += scalingFns[key]?.(scalingOptions[key]) ?? 0
  }
  number += scalingOptions.flat ?? 0
  return number
}