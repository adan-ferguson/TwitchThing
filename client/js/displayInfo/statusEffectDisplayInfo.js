import { STATUSEFFECT_COLORS } from '../colors.js'
import { effectInstanceState } from '../effectInstanceState.js'
import {
  optionalScaledNumber,
  statScaling,
  toSeconds,
  wrapStat,
  wrapStats
} from '../components/common.js'
import { explodeEffect } from '../../../game/baseEffects/statusEffectInstance.js'
import { msToS } from '../../../game/utilFunctions.js'

export function statusEffectDisplayInfo(effectInstance){

  const def = DEFS[effectInstance.name] ?? {}
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
  }
  return chunks
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

  if(statusEffectDef.stats){
    chunks.push(wrapStats(statusEffectDef.stats))
  }

  if(statusEffectDef.duration){
    chunks.push(`for ${toSeconds(optionalScaledNumber(statusEffectDef.duration, abilityInstance))}.`)
  }else if(statusEffectDef.turns){
    chunks.push(`for ${statusEffectDef.turns} turn${statusEffectDef.turns === 1 ? '' : 's'}.`)
  }else if(!statusEffectDef.persisting){
    chunks.push('until end of combat.')
  }else if(chunks.length){
    chunks[chunks.length - 1] += '.'
  }

  if(statusEffectDef.maxStacks){
    chunks.push(`Stacks up to ${statusEffectDef.maxStacks} times.`)
  }

  return chunks
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
    const chunks = ['a barrier that blocks']
    const params = def.vars.params
    if(params.hp.scaledNumber){
      chunks.push(statScaling(params.hp.scaledNumber, abilityInstance))
    }
    chunks.push('damage')
    return {
      grammatic: 'gain',
      description: chunks.join(' ')
    }
  },
  wideOpen: (def, abilityInstance) => {
    return {
      description: '"Attacks against you always crit"',
      grammatic: 'gain'
    }
  },
  sprinting: (def, abilityInstance) => {
    const chunks = []
    for(let key in def.stats){
      chunks.push(wrapStat(key, def.stats[key]))
    }
    return {
      description: `Gain ${chunks.join(' + ')} for the first ${msToS(chunks.duration)}s of combat.`
    }
  },
  stunned: () => {
    return {
      description: 'stunned',
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
  constricted: () => {
    return {
      description: '?'
    }
  }
}