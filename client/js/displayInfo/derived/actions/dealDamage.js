import { statScaling } from '../../../components/common.js'

export function derivedDealDamageDescription(attack, abilityInstance){
  const damageType = attack.damageType
  const scalingStr = statScaling(attack.scaling, abilityInstance, attack.range)
  const chunks = [`deal an extra ${scalingStr} ${damageType} damage.`]
  // abilityInstance?.parentEffect.exclusiveMods.forEach(mod => {
  //   const mdi = modDisplayInfo(mod)
  //   if(mdi.abilityDescription){
  //     chunks.push(mdi.abilityDescription)
  //   }
  // })
  return chunks
}