import { statScaling } from '../../../components/common.js'
import { modDisplayInfo } from '../../modDisplayInfo.js'
import { roundToFixed } from '../../../../../game/utilFunctions.js'

export function derivedAttackDescription(attack, abilityInstance){
  const damageType = attack.damageType
  const scalingStr = statScaling(attack.scaling, abilityInstance, attack.range)
  const times = attack.hits > 1 ?  attack.hits + ' times' : ''
  const chunks = ['Attack', times ,`for ${scalingStr} ${damageType} damage.`]

  if(attack.undodgeable){
    chunks.push('This can\'t be dodged.')
  }

  if(attack.lifesteal){
    chunks.push(`${roundToFixed(attack.lifesteal * 100, 2)}% lifesteal.`)
  }

  abilityInstance?.parentEffect.exclusiveMods.forEach(mod => {
    const mdi = modDisplayInfo(mod)
    if(mdi.abilityDescription){
      chunks.push(mdi.abilityDescription)
    }
  })

  return chunks
}