import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import AbilityInstance from '../../../game/abilityInstance.js'
import { derivedAttackDescription } from './derived/actions/attack.js'
import { statusEffectApplicationDescription } from './statusEffectDisplayInfo.js'
import {
  aboveIcon,
  attachedSkill,
  belowIcon,
  refundTime,
  statScaling,
  wrapStat
} from '../components/common.js'
import { takeDamageActionCalcDamage } from '../../../game/mechanicsFns.js'
import { derivedGainHealthDescription } from './derived/actions/gainHealth.js'
import { msToS, toPct } from '../../../game/utilFunctions.js'
import { derivedModifyAbilityDescription } from './derived/actions/modifyAbility.js'

const DEFS = {
  flutteringDodge: () => {
    return {
      description: 'Automatically dodge an attack.'
    }
  },
  tetheredManeuver: () => {
    return {
      description: `Whenever you use the above ${aboveIcon()} active ability, also use the below ${belowIcon()} active ability if possible.`
    }
  },
  spearPiercing: () => {
    return {
      description: attachedSkill() + ' Attached active ignores defense.'
    }
  },
  shrugOff: ability => {
    const hpString = statScaling(ability.actions[0].gainHealth.scaling, ability)
    return {
      description: `The next time you get would get debuffed, ignore it and recover ${hpString} health.`
    }
  },
  damageOverTime: ability => {
    const action = ability.actions[0].takeDamage
    const damage = takeDamageActionCalcDamage(ability, action.scaling)
    return {
      description: `Taking ${damage} ${action.damageType} damage.`
    }
  },
  mushroomSpores: ability => {
    return {
      description: 'When attacked, release spores which give the attacker a random debuff.'
    }
  },
  bearForm: () => {
    return {
      description: 'Turn into a bear!'
    }
  },
  sproutSaplings: () => {
    return {
      description: 'At the start of combat,<br/>sprout 3 Saplings.'
    }
  },
  mirrorImage: ability => {
    return {
      description: `Conjure ${ability.vars.clones} illusions.
      Enemy abilities have a ${toPct(ability.vars.chance)}% to hit a clone instead.`
    }
  },
  saplingBlock: () => {
    return {
      hide: true
    }
  },
  sprinting: ability => {
    return {
      description: `Get ${wrapStat('speed', ability.vars.speed)} for the first ${msToS(ability.vars.duration)}s of combat.`
    }
  },
  counterspell: () => {
    return {
      description: 'When an enemy casts a spell, counter it.'
    }
  }
}

const phantomEffectDefinitions = {
  attackAppliesStatusEffect: (def, abilityInstance) => {
    const chunks = ['On hit,']
    chunks.push(...statusEffectApplicationDescription({
      statusEffect: def,
      targets: 'target'
    }, abilityInstance))
    return chunks.join(' ')
  }
}

/**
 * @param obj {LoadoutObject|EffectInstance}
 * @returns {*[]|*}
 */
export function getAbilityDisplayInfoForObj(obj){
  if(!obj?.abilities){
    return []
  }
  return obj.abilities.map(getAbilityDisplayInfo).filter(a => a)
}

export function getAbilityDisplayInfo(ability){
  const definition = DEFS[ability.abilityId]?.(ability) ?? {}
  if(definition.hide){
    return null
  }
  return {
    ability,
    descriptionHTML: definition.description ?? abilityDescription(ability),
    type: ability.trigger === 'active' ? 'active' : 'nonactive',
    cooldown: ability.cooldown ?? ability.initialCooldown ?? null,
    initialCooldown: ability.initialCooldown ?? null
  }
}

function abilityDescription(ability){
  const chunks = []
  const abilityInstance = ability instanceof AbilityInstance ? ability : null
  chunks.push(...triggerPrefix(ability.trigger))
  chunks.push(...conditions(ability.conditions))

  let capitalize = true
  if(chunks.length){
    capitalize = false
    chunks[chunks.length - 1] += ','
  }
  ability.actions?.forEach(actionDef => {
    actionDef = expandActionDef(actionDef)
    let toAdd
    if(actionDef.attack){
      toAdd = derivedAttackDescription(actionDef.attack, abilityInstance)
    }else if(actionDef.applyStatusEffect){
      toAdd = statusEffectApplicationDescription(actionDef.applyStatusEffect, abilityInstance)
    }else if(actionDef.gainHealth){
      toAdd = derivedGainHealthDescription(actionDef.gainHealth, abilityInstance)
    }else if(actionDef.modifyAbility){
      toAdd = derivedModifyAbilityDescription(actionDef.modifyAbility, abilityInstance)
    }
    if(!toAdd?.length){
      return
    }
    if(capitalize){
      toAdd[0] = toAdd[0].charAt(0).toUpperCase() + toAdd[0].slice(1)
    }
    chunks.push(...toAdd)
    capitalize = true
  })
  if(ability.phantomEffect){
    const type = Object.keys(ability.phantomEffect.base)[0]
    if(phantomEffectDefinitions[type]){
      chunks.push(phantomEffectDefinitions[type](ability.phantomEffect.base[type], abilityInstance))
    }
  }
  if(ability.conditions){
    chunks.push(...conditionsDescription(ability.conditions))
  }
  if(ability.resetCooldownAfterCombat){
    chunks.push('Resets to initial cooldown after combat.')
  }
  if(ability.turnRefund > 0){
    chunks.push(`Refunds ${refundTime(toPct(ability.turnRefund))}.`)
  }
  return chunks.join(' ') //_.capitalize()
}

function startOfCombatPrefix(){
  return ['At the start of combat']
}

function conditionsDescription(conditions){
  if(conditions.owner?.hpPctBelow){
    return [`Only use when health is below ${conditions.owner.hpPctBelow * 100}%.`]
  }
  if(conditions.source){

  }
  return []
}

function triggerPrefix(trigger){
  if(!trigger){
    return []
  }
  if(trigger === 'startOfCombat' ){
    return [...startOfCombatPrefix()]
  }
  if(trigger === 'attackHit'){
    const type = trigger.conditions?.data?.damageType ? 'a ' + trigger.conditions.data.damageType : 'an'
    return ['After landing', type, 'attack']
  }
  if(trigger === 'rest'){
    return['After resting']
  }
  return []
}

function conditions(conditions){
  if(!conditions){
    return []
  }
  if(conditions.source === 'attached'){
    return [`with ${attachedSkill()}`]
  }
  return []
}