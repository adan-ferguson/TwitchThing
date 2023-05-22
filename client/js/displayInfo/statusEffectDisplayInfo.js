import { STATUSEFFECT_COLORS } from '../colors.js'
import { effectInstanceState } from '../effectInstanceState.js'
import { statScaling, toSeconds, wrapStat } from '../components/common.js'
import { explodeEffect } from '../../../game/baseEffects/statusEffectInstance.js'

export function statusEffectDisplayInfo(effectInstance){

  const def = DEFS[effectInstance.name] ?? {}
  let text = def.displayName ?? effectInstance.displayName ?? null
  if(!text){
    return null
  }

  if(effectInstance.stacks >= 2){
    text += ` x${effectInstance.stacks}`
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

  const abilityInfo = effectInstanceState(effectInstance)

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

export function statusEffectApplicationDescription(statusEffectDef, abilityInstance){
  const chunks = []
  statusEffectDef = explodeEffect(statusEffectDef)
  const statusEffectId = statusEffectDef.statusEffectId ?? statusEffectDef.name
  if(APPLICATION_DEFS[statusEffectId]){
    chunks.push(...APPLICATION_DEFS[statusEffectId](statusEffectDef, abilityInstance))
  }else if(statusEffectDef.stats){
    chunks.push('gain')
    for(let key in statusEffectDef.stats){
      chunks.push(wrapStat(key, statusEffectDef.stats[key]))
    }
  }
  if(statusEffectDef.duration){
    chunks.push(`for ${toSeconds(statusEffectDef.duration)}`)
  }else if(statusEffectDef.turns){
    chunks.push(`for ${statusEffectDef.turns} turn${statusEffectDef.turns === 1 ? '' : 's'}`)
  }else if(!statusEffectDef.persisting){
    chunks.push('until end of combat')
  }
  if(statusEffectDef.maxStacks){
    chunks.push(`Stacks up to ${statusEffectDef.maxStacks} times`)
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

}

const APPLICATION_DEFS = {
  damageOverTime: (def, abilityInstance) => {
    const chunks = ['take']
    const params = def.vars.params
    if(params.damage.scaledNumber){
      chunks.push(statScaling(params.damage.scaledNumber, abilityInstance))
    }
    chunks.push(`${params.damageType ?? 'phys'} damage per second`)
    return chunks
  },
  wideOpen: (def, abilityInstance) => {
    return ['Attacks against you always crit']
  }
}