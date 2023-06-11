import { expandActionDef } from '../../../game/actionDefs/expandActionDef.js'
import AbilityInstance from '../../../game/abilityInstance.js'
import { derivedAttackDescription } from './derived/actions/attack.js'
import { statusEffectApplicationDescription } from './statusEffectDisplayInfo.js'
import {
  aboveIcon, attachedItem,
  attachedSkill,
  belowIcon, capitalizeFirstChunk, describeStat, healthIcon, physPowerIcon,
  refundTime, scalingWrap,
  statScaling, toSeconds,
  wrapStat
} from '../components/common.js'
import { damageActionCalcDamage } from '../../../game/mechanicsFns.js'
import { derivedGainHealthDescription } from './derived/actions/gainHealth.js'
import { arrayize, msToS, toPct } from '../../../game/utilFunctions.js'
import { derivedModifyAbilityDescription } from './derived/actions/modifyAbility.js'
import { derivedDealDamageDescription } from './derived/actions/dealDamage.js'
import { derivedRemoveStatusEffectDescription } from './derived/actions/removeStatusEffect.js'
import { scaledNumberFromInstance } from '../../../game/scaledNumber.js'

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
    const damage = damageActionCalcDamage(ability, action.scaling)
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
      Enemy abilities have a ${toPct(ability.vars.chance)} to hit a clone instead.`
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
  },
  lightningStorm: ability => {
    return {
      description: `Conjure a storm which lasts ${msToS(ability.vars.duration)}s.
      Every 3s, it shoots a bolt which deals ${statScaling({ magicPower: ability.vars.magicPower }, ability, [0,1] )} magic damage and has 1/3 chance to stun the target for 3s.`
    }
  },
  zombieDisease: ability => {
    return {
      description: `After landing an attack, ${toPct(ability.conditions.random)}% chance to infect with a disease, lowering ${physPowerIcon()} and max ${healthIcon()}.`
    }
  },
  explode: ability => {
    return {
      description: `Explode, dealing magic damage equal to ${ability.vars.hpScaling}x remaining health. `
    }
  },
  bansheeWail: ability => {
    return {
      description: 'Attack for magic damage equal to 50% of the target\'s current health.'
    }
  },
  summonSkeleton: ability => {
    return {
      description: 'Summon a skeleton archer which shoots arrows.'
    }
  },
  shieldBash: ability => {
    let part2
    if(ability instanceof AbilityInstance){
      const block = toSeconds(scaledNumberFromInstance(ability, ability.vars.scaledNumber))
      part2 = `<span style="font-weight:bold;">${block}</span>.`
    }else{
      part2 = `${toSeconds(ability.vars.stunBase)} (increases with the ${describeStat('block')} stat of the ${attachedItem(true)}).`
    }
    return {
      description: `
      Bash the enemy for ${statScaling(ability.vars, ability)} phys damage.
      The target becomes stunned for ${part2}`
    }
  },
  spikedShield: ability => {
    return {
      description: `Return <b>${toPct(ability.vars.pctReturn)}</b> of blocked phys damage back at the attacker.`
    }
  },
}

const ACTION_DEFS = {
  balancedSmite: (actionDef, ability) => {
    const phys = statScaling({
      physPower: actionDef.power
    }, ability)
    const magic = statScaling({
      magicPower: actionDef.power
    }, ability)
    return {
      description: `Attack for ${phys} phys damage or ${magic} magic damage, whichever is lower. (Phys if tie)`
    }
  },
  shieldsUp: (actionDef, ability) => {
    return {
      description: `Restore your block barrier with an extra <b>${toPct(actionDef.multiplier - 1)}</b> strength. Only use when your block barrier is down.`
    }
  }
}

const phantomEffectDefinitions = {
  // attackAppliesStatusEffect: (def, abilityInstance) => {
  //   const chunks = ['On hit,']
  //   chunks.push(...statusEffectApplicationDescription({
  //     statusEffect: def,
  //     targets: 'target'
  //   }, abilityInstance))
  //   return chunks.join(' ')
  // }
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
  chunks.push(...prefix(ability.trigger, ability.conditions ?? {}))

  let capitalize = true
  if(chunks.length){
    capitalize = false
    chunks[chunks.length - 1] += ','
  }
  ability.actions?.forEach(actionDef => {
    let toAdd = []
    toAdd.push(...arrayize(actionDefDescription(actionDef, abilityInstance)))
    if(!toAdd?.length){
      return
    }
    if(capitalize){
      toAdd = capitalizeFirstChunk(toAdd)
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
  if(conditions.owner?.hasDebuff){
    return ['Only use if you have a debuff.']
  }
  return []
}

function prefix(trigger, conditions){
  const chunks = []
  if(trigger === 'startOfCombat' ){
    chunks.push(...startOfCombatPrefix())
  }
  if(trigger === 'attackHit'){
    const type = conditions.data?.damageType ? 'a ' + conditions.data.damageType : 'an'
    chunks.push('After landing', type, 'attack')
    if(conditions.source?.subjectKey === 'attached'){
      chunks.push(`with ${attachedSkill()}`)
    }
  }
  if(trigger === 'rest'){
    chunks.push('After resting')
  }
  return chunks
}

function actionDefDescription(actionDef, abilityInstance){
  actionDef = expandActionDef(actionDef)
  if(actionDef.attack){
    const val = derivedAttackDescription(actionDef.attack, abilityInstance)
    if(actionDef.attack.onHit){
      val.push(...arrayize(actionDefDescription(actionDef.attack.onHit, abilityInstance)))
    }
    return val
  }else if(actionDef.applyStatusEffect){
    return statusEffectApplicationDescription(actionDef.applyStatusEffect, abilityInstance)
  }else if(actionDef.gainHealth){
    return derivedGainHealthDescription(actionDef.gainHealth, abilityInstance)
  }else if(actionDef.modifyAbility){
    return derivedModifyAbilityDescription(actionDef.modifyAbility, abilityInstance)
  }else if(actionDef.dealDamage){
    return derivedDealDamageDescription(actionDef.dealDamage, abilityInstance)
  }else if(actionDef.removeStatusEffect){
    return derivedRemoveStatusEffectDescription(actionDef.removeStatusEffect)
  }else{
    const key = Object.keys(actionDef)[0]
    if(ACTION_DEFS[key]){
      return ACTION_DEFS[key](actionDef[key], abilityInstance).description
    }
  }
  return null
}