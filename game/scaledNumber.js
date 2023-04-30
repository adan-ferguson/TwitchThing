const VALID_KEYS = ['hpMax', 'hpMissingPct', 'hp', 'magicPower', 'physPower']

export function scaledNumberFromFighterInstance(fighterInstance, scalingOptions){
  return scaledNumber(scalingOptions, {
    hpMax: () => fighterInstance.hpMax,
    hpMissing:  () => fighterInstance.hpMax - fighterInstance.hp,
    hp: () => fighterInstance.hp,
    magicPower: () => fighterInstance.magicPower,
    physPower: () => fighterInstance.physPower,
  })
}

export function scaledNumberFromAbilityInstance(abilityInstance, scalingOptions){
  const fighterInstance = abilityInstance.fighterInstance
  return scaledNumber(scalingOptions, {
    hpMax: () => fighterInstance.hpMax,
    hpMissing:  () => fighterInstance.hpMax - fighterInstance.hp,
    hp: () => fighterInstance.hp,
    magicPower: () => abilityInstance.exclusiveStats.get('magicPower').value,
    physPower: () => abilityInstance.exclusiveStats.get('physPower').value,
  })
}

function scaledNumber(scalingOptions, scalingFns){
  let number = 0
  VALID_KEYS.forEach(key => {
    if(scalingOptions[key]){
      number += scalingFns[key]() * scalingOptions[key]
    }
  })
  number += scalingOptions.flat ?? 0
  return number
}