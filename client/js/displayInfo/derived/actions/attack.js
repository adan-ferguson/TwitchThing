import { scalingWrap } from '../../../components/common.js'

export function derivedAttackDescription(attack, abilityInstance){
  let scalingStr = ''
  const damageType = attack.damageType
  const scaling = attack.scaling
  for(let scalingType in attack.scaling){
    if(['physPower', 'magicPower'].includes(scalingType)){
      scalingStr += statScaling(scalingType)
    }
  }
  return [`Attack for ${scalingStr} ${damageType} damage.`]
  // let valStr
  // if(attack.range){
  //   const min = attack.damageMulti * attack.range[0]
  //   const max = attack.damageMulti * attack.range[1]
  //   valStr = scalingWrap(scalingType, `${min}-${max}`)
  // }else{
  //   valStr = `[${scaling}Attack${attack.damageMulti}]`
  // }

  function statScaling(scalingType){
    let str
    const val = scaling[scalingType]
    if(abilityInstance){
      str = Math.ceil(val * abilityInstance.exclusiveStats.get(scalingType).value)
    }else{
      str = `${val * 100}%`
    }
    return scalingWrap(scalingType, str)
  }
}