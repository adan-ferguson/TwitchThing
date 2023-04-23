import LoadoutObject from '../../../game/loadoutObject.js'
import EffectInstance from '../../../game/effectInstance.js'

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
  if(obj instanceof LoadoutObject){
    return obj.data.effectData.abilities.map(getAbilityDisplayInfo)
  }else if(obj instanceof EffectInstance){
    return obj.abilities.map(getAbilityDisplayInfo)
  }
  return []
}

export function getAbilityDisplayInfo(ability){
  const definition = abilityDefinitions[ability.name]?.(ability) ?? {}
  return {
    ability,
    descriptionHTML: definition.description ?? abilityDescription(ability),
    type: ability.trigger === 'active' ? 'active' : 'nonactive'
  }
}

function abilityDescription(ability){
  return ''
  // const derived = deriveActionStrings(ability.actions)
  // let str
  // if(ability.description){
  //   str = ability.description.replace(/{A(\d+)}/g, (a, b, c) => {
  //     return derived[b]
  //   })
  // }else{
  //   str = derived.filter(s => s).join(' ')
  // }
  // return parseDescriptionString(str, useStats)
}

function deriveActionStrings(actions){
  const strs = []
  derive(actions)
  function derive(actions){
    actions.forEach(action => {
      if(isArray(action)){
        return derive(action)
      }
      if(action.description){
        strs.push(action.description)
      }else if(action.type === 'attack'){
        strs.push(toAttackString(action))
      }else if(action.type === 'gainHealth'){
        strs.push(toGainHealthString(action))
      }else{
        strs.push('')
      }
    })
  }
  return strs
}

function toAttackString(action){
  const scaling = action.damageScaling === 'auto' ? action.damageType : action.damageScaling
  let valStr
  if(action.range){
    const min = action.damageMulti * action.range[0]
    const max = action.damageMulti * action.range[1]
    valStr = `[${scaling}Attack${min}] to [${scaling}Attack${max}]`
  }else{
    valStr = `[${scaling}Attack${action.damageMulti}]`
  }
  return `Attack for ${valStr} ${action.damageType} damage.`
}

function toGainHealthString(action){
  if(action.scaling.magicPower){
    return `Recover [magicScaling${action.scaling.magicPower}] health.`
  }
  return 'Recover <BUGGED AMOUNT LOL> health.'
}