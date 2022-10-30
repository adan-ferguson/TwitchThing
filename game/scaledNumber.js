export default function(owner, scalingOptions){

  scalingOptions = {
    hpMax: 0,
    hpMissingPct: 0,
    hp: 0,
    magicPower: 0,
    physPower: 0,
    flat: 0,
    ...scalingOptions
  }

  let number = 0
  number += owner.hpMax * scalingOptions.hpMax
  number += (owner.hpMax - owner.hp) * scalingOptions.hpMissingPct
  number += owner.hp * scalingOptions.hp
  number += owner.magicPower * scalingOptions.magicPower
  number += owner.physPower * scalingOptions.physPower
  number += scalingOptions.flat
  return number
}