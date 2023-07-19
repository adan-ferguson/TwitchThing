import AbilityInstance from '../../../game/abilityInstance.js'
import {
  aboveIcon,
  attachedItem,
  attachedSkill,
  belowIcon,
  describeStat, refundTime,
  statScaling,
  wrapStat, wrapStats
} from '../components/common.js'
import { damageActionCalcDamage } from '../../../game/mechanicsFns.js'
import { arrayize, msToS, toPct } from '../../../game/utilFunctions.js'
import { keyword } from './keywordDisplayInfo.js'
import { actionArrayDescriptions } from './actionDisplayInfo.js'

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
  bearForm: () => {
    return {
      description: 'Turn into a bear!'
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
      description: `Attacks have ${toPct(ability.conditions.random)}% chance to infect with a disease.`
    }
  },
  waspSting: ability => {
    return {
      description: `Attacks have ${toPct(ability.vars.chance)} chance to poison.`
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
  immaculateShield: ability => {
    return {
      description: 'As long as your <b>Block</b> barrier is up, you can\'t be debuffed.'
    }
  },
  constrict: ability  => {
    return {
      description: `Wrap the enemy up, giving them ${wrapStat('speed', ability.vars.speed)} each second.`
    }
  },
  constrictAddStack: ability => {
    return {
      hide: true
    }
  },
  deadlyGaze: ability => {
    return {
      description:`${toPct(ability.vars.chance)} chance to deal 100% of the target's max health as magic damage.`
    }
  },
  hex: ability => {
    return {
      description: 'Turn the enemy into a random critter.'
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
    descriptionHTML: abilityDescription(ability),
    type: ability.trigger === 'active' ? 'active' : 'nonactive',
    cooldown: ability.cooldown ?? ability.initialCooldown ?? null,
    initialCooldown: ability.initialCooldown ?? null
  }
}

function abilityDescription(ability){
  const chunks = []
  const abilityInstance = ability instanceof AbilityInstance ? ability : null
  chunks.push(...prefix(ability.trigger, ability.conditions ?? {}))
  chunks.push(...arrayize(replacementsDescription(ability.replacements, ability, abilityInstance)))
  chunks.push(...actionArrayDescriptions(ability.actions, abilityInstance))

  // if(ability.phantomEffect){
  //   const type = Object.keys(ability.phantomEffect.base)[0]
  //   if(phantomEffectDefinitions[type]){
  //     chunks.push(phantomEffectDefinitions[type](ability.phantomEffect.base[type], abilityInstance))
  //   }
  // }
  if(ability.conditions){
    chunks.push(...conditionsDescription(ability.conditions))
  }
  if(ability.resetAfterCombat && ability.cooldown){
    chunks.push('<br/><br/>Cooldown resets after combat.')
  }
  if(ability.turnRefund > 0){
    chunks.push(`Refunds ${refundTime(toPct(ability.turnRefund))}.`)
  }
  if(ability.exclusiveStats){
    const statsDisp = wrapStats(ability.exclusiveStats, { exclude: ['physPower','magicPower'] })
    if(statsDisp.innerHTML){
      chunks.push(`Benefits from ${statsDisp}.`)
    }
  }

  return chunks.join(' ')
}

function startOfCombatPrefix(){
  return ['At the start of combat']
}

function replacementsDescription(replacements, abilityDef, abilityInstance){
  if(!replacements){
    return
  }
  // TODO: this is hacky
  if(replacements.cancel === 'shrugOff'){
    return 'Ignore it.'
  }
  if(replacements.cancel === 'dodge'){
    return 'Dodge it.'
  }
  if(replacements.cancel && abilityDef.trigger ==='dying'){
    return 'Survive with 1 health.'
  }
  if(replacements.cancel === 'countered'){
    return 'Counter it.'
  }
  if(abilityDef.abilityId === 'immaculateShield'){
    return `Ignore it if your ${describeStat('block')} barrier is up.`
  }
}

function conditionsDescription(conditions){
  if(conditions.owner?.hpPctBelow){
    return [`Only use when health is below ${conditions.owner.hpPctBelow * 100}%.`]
  }
  if(conditions.owner?.hpFull){
    return ['Only use when health is at 100%.']
  }
  if(conditions.owner?.hasDebuff){
    return ['Only use if you are debuffed.']
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
      chunks.push(`with ${attachedSkill()} `)
    }
  }
  if(trigger === 'rest'){
    chunks.push('After resting')
  }
  if(trigger === 'takeTurn'){
    chunks.push('After your turn')
  }
  if(trigger === 'thwart'){
    chunks.push(`After ${keyword('thwart', 'Thwarting')} an enemy ability`)
  }
  if(trigger === 'crit'){
    chunks.push('After landing a crit')
  }
  if(trigger === 'hitByAttack'){
    const type = conditions.data?.damageType ? 'a ' + conditions.data.damageType : 'an'
    chunks.push('After being hit by', type, 'attack')
    if(conditions.source?.subjectKey === 'attached'){
      chunks.push(`with ${attachedSkill()}`)
    }
  }
  if(trigger === 'attacked'){
    chunks.push('When attacked')
  }
  if(trigger === 'dying'){
    chunks.push('On death')
  }
  if(trigger === 'gainingDebuff'){
    chunks.push('When gaining a debuff')
  }
  if(trigger === 'useActiveAbility'){
    chunks.push('After using an active ability')
  }
  if(trigger === 'enemyUseActiveAbility'){
    chunks.push('When an enemy uses an active ability')
  }
  if(conditions?.random){
    chunks.push(`(${toPct(conditions.random)} chance)`)
  }
  if(chunks.length){
    return [chunks.join(' ') + ':']
  }
  return chunks
}