import { isArray } from 'lodash'
import LoadoutObjectInstance from '../../../game/loadoutObjectInstance.js'
import StatusEffectInstance from '../../../game/statusEffectInstance.js'
import AdventurerLoadoutObject from '../../../game/adventurerLoadoutObject.js'
import { adventurerLoadoutObjectDisplayInfo } from './adventurerLoadoutObjectDisplayInfo.js'
import { monsterItemDisplayInfo } from './monsterItemDisplayInfo.js'
import MonsterItem from '../../../game/monsterItem.js'
import { abilitiesObjToArray } from '../../../game/effectInstance.js'

export const AbilityState = {
  NONE: 'none',
  DISABLED: 'disabled',
  READY: 'ready',
  RECHARGING: 'recharging',
  IDLE: 'idle'
}

export function getAbilityDisplayInfo(obj){
  if(obj instanceof LoadoutObject){
    return fromLoadoutObject(obj)
  }else if(obj instanceof EffectInstance){
    return fromEffectInstance(obj)
  }else if(obj instanceof StatusEffectInstance){
    return fromStatusEffectInstance(obj)
  }
  return []
}

function fromEffectInstance(ei){
  const fn = ei instanceof StatusEffectInstance ?
    statusEffectDisplayInfo :
    loadoutEffectDisplayInfo
  const info = fn(ei)
  return ei.abilities.map(ai => {
    return {
      abilityDef: ai.abilityDef,
      actionKey: ai.actionKey,
      type: ai.type,
      descriptionHTML: info.abilityDescription ?? abilityInstanceDescription(ai)
    }
  })
}


function fromLoadoutObject(loadoutObject){
  const fn = loadoutObject instanceof AdventurerLoadoutObject ?
    adventurerLoadoutObjectDisplayInfo :
    monsterItemDisplayInfo
  const info = fn(loadoutObject)
  return abilitiesObjToArray(loadoutObject.effect.abilities).map(({ abilityDef, actionKey, type }) => {
    return {
      abilityDef,
      actionKey,
      type,
      descriptionHTML: info.abilityDescription ?? abilityDescription(abilityDef)
    }
  })
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