import LoadoutObject from '../../../game/loadoutObject.js'
import EffectInstance from '../../../game/effectInstance.js'
import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import { scalingWrap, scalingWrapPct } from '../components/common.js'
import AbilityInstance from '../../../game/abilityInstance.js'
import _ from 'lodash'
import { derivedAttackDescription } from './derived/actions/attack.js'
import { derivedApplyStatusEffectDescription } from './derived/actions/applyStatusEffect.js'

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
  if(abilityInstance.trigger.combatTime){
    chunks.push(combatTimePrefix(abilityInstance.trigger.combatTime))
  }
  ability.actions?.forEach(actionDef => {
    actionDef = expandActionDef(actionDef)
    if(actionDef.attack){
      chunks.push(...derivedAttackDescription(actionDef.attack, abilityInstance))
    }
    if(actionDef.applyStatusEffect){
      chunks.push(...derivedApplyStatusEffectDescription(actionDef.applyStatusEffect, abilityInstance))
    }
  })
  return chunks.join(' ')
}

// function toGainHealthString(action){
//   if(action.scaling.magicPower){
//     return `Recover [magicScaling${action.scaling.magicPower}] health.`
//   }
//   return 'Recover <BUGGED AMOUNT LOL> health.'
// }

function combatTimePrefix(val){
  if(val === 1){
    return 'Start of Combat:'
  }
  throw 'Not implemented combatTimePrefix'
}