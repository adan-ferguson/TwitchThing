import { statScaling } from '../../../components/common.js'

export function derivedAttackDescription(attack, abilityInstance){
  const damageType = attack.damageType
  const scalingStr = statScaling(attack.scaling, abilityInstance, attack.range)
  return [`Attack for ${scalingStr} ${damageType} damage.`]
}