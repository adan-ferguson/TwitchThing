import { STATUSEFFECT_COLORS } from '../colors.js'
import { effectInstanceState } from '../effectInstanceState.js'
import {
  capitalizeFirstChunk,
  optionalScaledNumber,
  statScaling,
  toSeconds,
  wrapStat,
  wrapStats
} from '../components/common.js'
import { explodeEffect } from '../../../game/baseEffects/statusEffectInstance.js'
import { arrayize, toPct } from '../../../game/utilFunctions.js'
import { keyword } from './keywordDisplayInfo.js'

export function statusEffectDisplayInfo(effectInstance){

  const def = DEFS[effectInstance.name]?.(effectInstance.effectData) ?? {}
  let text = def.displayName ?? effectInstance.displayName ?? null
  if(!text){
    return null
  }

  const abilityInfo = effectInstanceState(effectInstance)

  if(abilityInfo.abilityUses){
    text += ` (${abilityInfo.abilityUses})`
  }else if(effectInstance.stacks >= 2){
    text += ` x${effectInstance.stacks}`
  }

  const colors = getColors(effectInstance)

  let barValue = 1, barMax = 1, showValue = false, timed = false
  if(effectInstance.duration){
    barValue = effectInstance.durationRemaining
    barMax = effectInstance.duration
    timed = true
  }else if(effectInstance.barrier){
    barValue = effectInstance.barrierHp
    barMax = effectInstance.barrierHpMax
    showValue = true
  }

  return {
    text,
    barValue,
    barMax,
    abilityInfo,
    colors,
    timed,
    animateChanges: effectInstance.duration ? false : true,
    showValue
  }
}

function derivedPrefix(actionDef, abilityInstance){
  const chunks = []
  const statusEffectDef = explodeEffect(actionDef.statusEffect)
  const statusEffectId = statusEffectDef.statusEffectId ?? statusEffectDef.name
  const def = DEFS[statusEffectId]?.(statusEffectDef, abilityInstance) ?? {}
  let grammatic = def.grammatic ?? 'get'
  if(grammatic !== ''){
    if(actionDef.targets !== 'self'){
      grammatic += 's'
    }
  }
  if(actionDef.targets === 'self'){
    chunks.push(grammatic)
  }else if(actionDef.targets === 'target'){
    chunks.push(`the target ${grammatic}`)
  }else if(actionDef.targets === 'enemy'){
    chunks.push(`enemy ${grammatic}`)
  }else if(actionDef.targets === 'all'){
    chunks.push(`everyone ${grammatic}`)
  }
  return capitalizeFirstChunk(chunks)
}

export function statusEffectApplicationDescription(applyStatusEffectDef, abilityInstance){
  const chunks = []
  chunks.push(...derivedPrefix(applyStatusEffectDef, abilityInstance))
  chunks.push(...statusEffectDescription(applyStatusEffectDef.statusEffect, abilityInstance))
  return chunks
}

export function statusEffectDescription(statusEffectDef, abilityInstance){

  statusEffectDef = explodeEffect(statusEffectDef)

  const chunks = []
  const statusEffectId = statusEffectDef.statusEffectId ?? statusEffectDef.name
  const def = DEFS[statusEffectId]?.(statusEffectDef, abilityInstance) ?? {}

  if(def.description){
    chunks.push(def.description)
  }

  if(statusEffectDef.stats && !def.statsHandled){
    if(chunks.length){
      chunks.push('and gets')
    }
    chunks.push(wrapStats(statusEffectDef.stats))
  }

  chunks.push(...arrayize(statusEffectDuration(statusEffectDef, abilityInstance)).filter(a => a))
  if(statusEffectDef.stacking === 'stack'){
    chunks.push(keyword('stacks'))
  }
  chunks[chunks.length - 1] += '.'

  if(statusEffectDef.maxStacks){
    chunks.push(`Stacks up to <b>${statusEffectDef.maxStacks}</b> times.`)
  }

  if(def.endChunk){
    chunks.push(def.endChunk)
  }

  return chunks
}

export function statusEffectDuration(statusEffectDef, abilityInstance){
  if(statusEffectDef.duration){
    return [
      `for ${toSeconds(optionalScaledNumber(statusEffectDef.duration, abilityInstance))}`,
      statusEffectDef.diminishingReturns ? keyword('diminishingReturns') : null
    ]
  }else if(statusEffectDef.turns){
    return `for ${statusEffectDef.turns} turn${statusEffectDef.turns === 1 ? '' : 's'}`
  }else if(statusEffectDef.persisting === false){
    return 'until end of combat'
  }
}

function getColors(effectInstance){
  if(effectInstance.barrier){
    return STATUSEFFECT_COLORS.barrier
  }
  return STATUSEFFECT_COLORS[effectInstance.polarity]
}

const DEFS = {
  damageOverTime: (def, abilityInstance) => {
    const chunks = []
    const params = def.vars.params
    if(params.damage.scaledNumber){
      chunks.push(statScaling(params.damage.scaledNumber, abilityInstance))
    }
    chunks.push(`${params.damageType ?? 'phys'} damage every 3 seconds`)
    return {
      description: chunks.join(' '),
      grammatic: 'take'
    }
  },
  barrier: (def, abilityInstance) => {
    const chunks = ['a barrier with']
    const params = def.vars.params
    if(params.hp.scaledNumber){
      chunks.push(statScaling(params.hp.scaledNumber, abilityInstance))
    }
    chunks.push('power')

    if(def.stats){
      chunks.push(`which grants you ${wrapStats(def.stats)}`)
    }

    return {
      grammatic: 'gain',
      description: chunks.join(' '),
      statsHandled: true,
    }
  },
  wideOpen: (def, abilityInstance) => {
    return {
      description: 'Attacks against you always crit',
      grammatic: ''
    }
  },
  stunned: () => {
    return {
      description: keyword('stunned'),
      grammatic: 'become'
    }
  },
  blinded: () => {
    return {
      description: keyword('blinded'),
      grammatic: 'become'
    }
  },
  disarmed: () => {
    return {
      description: 'disarmed, disabling one of their items',
      grammatic: 'become'
    }
  },
  feared: () => {
    return {
      description: 'feared and can\'t use basic attacks',
      grammatic: 'become'
    }
  },
  cleansed: () => {
    return {
      description: 'You can\'t gain debuffs',
      grammatic: ''
    }
  },
  diminishingReturns: () => {
    return {
      displayName: keyword('diminishingReturns')
    }
  },
  asleep: () => {
    return {
      grammatic: 'fall',
      description: keyword('asleep')
    }
  },
  illusion: (def, abilityInstance) => {
    return {
      grammatic: 'conjure',
      description: `${def.vars.clones} illusions. Enemy abilities have a ${toPct(def.vars.chance)} chance to hit an illusion instead`
    }
  },
  patience: () => {
    return {
      endChunk: 'Remove these at end of combat.'
    }
  },
  bearForm: () => {
    return {
      description: 'Turn into a bear',
      grammatic: '',
      statsHandled: true,
    }
  },
  sproutSaplings: () => {
    return {
      description: 'Sprout 3 Saplings which intercept abilities',
      grammatic: '',
    }
  },
  finalFight: effectData => {
    return {
      grammatic: '',
      description: `You can't die and you gain ${wrapStats(effectData.stats)}`,
      statsHandled: true,
    }
  },
  skeletonArcher: () => {
    return {
      grammatic: '',
      description: 'Summon a skeleton archer'
    }
  },
  constricted: effectDef => {
    return {
      grammatic: 'become',
      description: `wrapped up, giving them ${wrapStat('speed', effectDef.stats.speed)} every 3 seconds.`,
      statsHandled: true
    }
  },
  charmed: effectDef => {
    return {
      grammatic: 'become',
      description: `${keyword('charmed')}`
    }
  },
  lightningStorm: (effectDef, abilityInstance) => {
    return {
      grammatic: 'summon',
      description: 'a lightning storm which periodically attacks the enemy'
    }
  },
  noDie: (effectDef) => {
    return {
      grammatic: 'gain',
      description: '"No Die!"'
    }
  }
}