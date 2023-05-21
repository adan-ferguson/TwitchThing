import { statScaling } from '../../../components/common.js'
import { modDisplayInfo } from '../../modDisplayInfo.js'

export function derivedAttackDescription(attack, abilityInstance){
  const damageType = attack.damageType
  const scalingStr = statScaling(attack.scaling, abilityInstance, attack.range)
  const chunks = [`Attack for ${scalingStr} ${damageType} damage.`]

  abilityInstance?.parentEffect.exclusiveMods.forEach(mod => {
    const mdi = modDisplayInfo(mod)
    if(mdi?.abilityDescription){
      chunks.push(mdi.abilityDescription)
    }
  })

  return chunks
}