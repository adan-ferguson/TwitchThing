import AbilityInstance from './abilityInstance.js'
import { getMatchingEffectInstances } from './subjectFns.js'

const VALID_KEYS = ['hpMax', 'hpMissingPct', 'hp', 'magicPower', 'physPower']

const fighterFns = fighterInstance => {
  return {
    hpMax: val => val * fighterInstance.hpMax,
    hpMissing:  val => val * (fighterInstance.hpMax - fighterInstance.hp),
    hp: val => val * fighterInstance.hp,
    magicPower: val => val * fighterInstance.magicPower,
    physPower: val => val * fighterInstance.physPower,
    effectStats: () => 0
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
    effectStats: (options = {}) => {
      options = {
        base: null,
        stat: null,
        subjectKey: 'self',
        ...options
      }
      let total = 0
      if(options.subjectKey){
        getMatchingEffectInstances(abilityInstance.parentEffect, options.subjectKey)
          .forEach(ei => {
            total += options.base * ei.stats.get(options.stat).value
          })
      }
      return total
    }
  })
}

export function scaledNumberFromInstance(instance, scalingOptions){
  return instance instanceof AbilityInstance ?
    scaledNumberFromAbilityInstance(instance, scalingOptions) :
    scaledNumberFromFighterInstance(instance, scalingOptions)
}

function scaledNumber(scalingOptions, scalingFns){
  let number = 0
  VALID_KEYS.forEach(key => {
    if(scalingOptions[key]){
      number += scalingFns[key](scalingOptions[key])
    }
  })
  number += scalingOptions.flat ?? 0
  return number
}