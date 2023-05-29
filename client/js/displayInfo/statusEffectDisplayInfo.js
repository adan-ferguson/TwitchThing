import { STATUSEFFECT_COLORS } from '../colors.js'
import { effectInstanceState } from '../effectInstanceState.js'
import { statScaling, toSeconds, wrapStat } from '../components/common.js'
import { explodeEffect } from '../../../game/baseEffects/statusEffectInstance.js'
import { msToS } from '../../../game/utilFunctions.js'

export function statusEffectDisplayInfo(effectInstance){

  const def = DEFS[effectInstance.name] ?? {}
  let text = def.displayName ?? effectInstance.displayName ?? null
  if(!text){
    return null
  }

  const abilityInfo = effectInstanceState(effectInstance)

  if(effectInstance.stacks >= 2){
    text += ` x${effectInstance.stacks}`
  }else if(abilityInfo.abilityUses){
    text += ` (${abilityInfo.abilityUses})`
  }

  const colors = getColors(effectInstance)

  let barValue = 1, barMax = 1, showValue = false, timed = false
  if(effectInstance.duration){
    barValue = effectInstance.durationRemaining
    barMax = effectInstance.duration
    timed = true
  }else if(effectInstance.barrier){
    barValue = effectInstance.barrierPointsRemaining
    barMax = effectInstance.barrier.points
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
  const grammatic = def.grammatic ?? 'get'
  if(actionDef.targets === 'self'){
    chunks.push(grammatic)
  }else if(actionDef.targets === 'target'){
    chunks.push(`the target ${grammatic}s`)
  }else if(actionDef.targets === 'enemy'){
    chunks.push(`enemy ${grammatic}s`)
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
    for(let key in statusEffectDef.stats){
      chunks.push(wrapStat(key, statusEffectDef.stats[key]))
    }
  }

  if(statusEffectDef.duration){
    chunks.push(`for ${toSeconds(statusEffectDef.duration)}.`)
  }else if(statusEffectDef.turns){
    chunks.push(`for ${statusEffectDef.turns} turn${statusEffectDef.turns === 1 ? '' : 's'}.`)
  }else if(!statusEffectDef.persisting){
    chunks.push('until end of combat.')
  }else{
    chunks.push('.')
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
}