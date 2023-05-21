import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import AbilityInstance from '../../../game/abilityInstance.js'
import { derivedAttackDescription } from './derived/actions/attack.js'
import { derivedApplyStatusEffectDescription } from './derived/actions/applyStatusEffect.js'
import { derivedGainHealthDescription } from './derived/actions/gainHealth.js'
import { roundToFixed } from '../../../game/utilFunctions.js'
import { statusEffectApplicationDescription } from './statusEffectDisplayInfo.js'
import { attachedSkill } from '../components/common.js'
import { takeDamageActionCalcDamage } from '../../../game/mechanicsFns.js'

const abilityDefinitions = {
  flutteringDodge: () => {
    return {
      description: 'Automatically dodge an attack.'
    }
  },
  serratedBladeTrigger: () => {

  },
  spearPiercing: () => {
    return {
      description: attachedSkill() + ' Attached active ignores defense.'
    }
  },
  damageOverTime: ability => {
    const action = ability.actions[0].takeDamage
    const damage = takeDamageActionCalcDamage(ability, action.scaling)
    return {
      description: `Taking ${damage} ${action.damageType} damage.`
    }
  }
}

const phantomEffectDefinitions = {
  attackAppliesStatusEffect: (def, abilityInstance) => {
    const chunks = ['On hit,']
    chunks.push(statusEffectApplicationDescription(def, abilityInstance))
    chunks.push(`for ${roundToFixed(def.duration / 1000, 2)} seconds.`)
    return chunks
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
    type: ability.trigger.active ? 'active' : 'nonactive',
    cooldown: ability.cooldown ?? ability.initialCooldown ?? null,
    initialCooldown: ability.initialCooldown ?? null
  }
}

function abilityDescription(ability){
  const chunks = []
  const abilityInstance = ability instanceof AbilityInstance ? ability : null
  if(ability.trigger.combatTime){
    chunks.push(combatTimePrefix(ability.trigger.combatTime))
  }
  if(ability.trigger.attackHit){
    chunks.push('After landing an attack:')
  }
  ability.actions?.forEach(actionDef => {
    actionDef = expandActionDef(actionDef)
    if(actionDef.attack){
      chunks.push(...derivedAttackDescription(actionDef.attack, abilityInstance))
    }
    if(actionDef.applyStatusEffect){
      chunks.push(...derivedApplyStatusEffectDescription(actionDef.applyStatusEffect, abilityInstance))
    }
    if(actionDef.gainHealth){
      chunks.push(...derivedGainHealthDescription(actionDef.gainHealth, abilityInstance))
    }
  })
  if(ability.phantomEffect){
    const type = Object.keys(ability.phantomEffect.base)[0]
    chunks.push(...phantomEffectDefinitions[type](ability.phantomEffect.base[type], abilityInstance))
  }
  if(ability.conditions){
    chunks.push(...conditionsDescription(ability.conditions))
  }
  return chunks.join(' ')
}

function combatTimePrefix(val){
  if(val === 1){
    return 'Start of Combat:<br/>'
  }
  throw 'Not implemented combatTimePrefix'
}

function conditionsDescription(conditions){
  if(conditions.hpPctBelow){
    return [`Only use when health is below ${conditions.hpPctBelow * 100}%.`]
  }
  if(conditions.source){

  }
  return []
}