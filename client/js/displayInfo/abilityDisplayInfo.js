import AbilityInstance from '../../../game/abilityInstance.js'
import { attachedSkill, describeStat, refundTime, wrapStats } from '../components/common.js'
import { arrayize, toPct } from '../../../game/utilFunctions.js'
import { keyword } from './keywordDisplayInfo.js'
import { abilityActionsDescriptions } from './actionDisplayInfo.js'

const DEFS = {
  saplingBlock: () => {
    return {
      hide: true
    }
  },
  constrictAddStack: ability => {
    return {
      hide: true
    }
  },
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
  chunks.push(...abilityActionsDescriptions(ability, abilityInstance))

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
    if(statsDisp){
      chunks.push(`This ability benefits from ${statsDisp}.`)
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
    if(conditions.source?.key === 'attached'){
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
    if(conditions.source?.key === 'attached'){
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