import LoadoutObject from '../../../game/loadoutObject.js'
import EffectInstance from '../../../game/effectInstance.js'
import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import { scalingWrap, scalingWrapPct } from '../components/common.js'
import AbilityInstance from '../../../game/abilityInstance.js'
import _ from 'lodash'

const abilityDefinitions = {
  flutteringDodge: () => {
    return {
      description: 'Automatically dodge an attack.'
    }
  },
  serratedBladeTrigger: () => {

  }
}

/**
 * @param obj {LoadoutObject|EffectInstance}
 * @returns {*[]|*}
 */
export function getAbilityDisplayInfoForObj(obj){
  return obj.abilities.map(getAbilityDisplayInfo)
}

export function getAbilityDisplayInfo(ability){
  const definition = abilityDefinitions[ability.abilityId]?.(ability) ?? {}
  return {
    ability,
    descriptionHTML: definition.description ?? abilityDescription(ability),
    type: ability.trigger === 'active' ? 'active' : 'nonactive'
  }
}

function abilityDescription(ability){
  const chunks = []
  const abilityInstance = ability instanceof AbilityInstance ? ability : null
  ability.actions?.forEach(actionDef => {
    actionDef = expandActionDef(actionDef)
    if(actionDef.attack){
      chunks.push(attackDescription(actionDef.attack, abilityInstance))
    }
  })
  return chunks.join(' ')
}

function deriveActionStrings(actions){
  const strs = []
  derive(actions)
  function derive(actions){
    actions.forEach(action => {
      if(action.type === 'gainHealth'){
        strs.push(toGainHealthString(action))
      }else{
        strs.push('')
      }
    })
  }
  return strs
}

function attackDescription(attack, abilityInstance){
  let scalingStr = ''
  const damageType = attack.damageType
  const scaling = attack.scaling
  for(let scalingType in attack.scaling){
    if(['physPower', 'magicPower'].includes(scalingType)){
      scalingStr += statScaling(scalingType)
    }
  }
  return `Attack for ${scalingStr} ${damageType} damage.`
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

function toGainHealthString(action){
  if(action.scaling.magicPower){
    return `Recover [magicScaling${action.scaling.magicPower}] health.`
  }
  return 'Recover <BUGGED AMOUNT LOL> health.'
}