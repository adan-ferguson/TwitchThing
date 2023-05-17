import { STATUSEFFECT_COLORS } from '../colors.js'
import { effectInstanceState } from '../effectInstanceState.js'
import { statScaling, toSeconds, wrapStat } from '../components/common.js'

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

export function statusEffectDescription(statusEffectDef){
  const chunks = []
  if(statusEffectDef.stats){
    for(let key in statusEffectDef.stats){
      chunks.push(wrapStat(key, statusEffectDef.stats[key]))
    }
  }
  if(statusEffectDef.duration){
    chunks.push(`for ${toSeconds(statusEffectDef.duration)}`)
  }else if(!statusEffectDef.persisting){
    chunks.push('until end of combat')
  }
  return { chunks }
}

export function statusEffectApplicationDescription(statusEffectDef, abilityInstance){
  const abilityId = Object.keys(statusEffectDef.base)[0]
  return APPLICATION_DEFS[abilityId](statusEffectDef.base[abilityId], abilityInstance)
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
    const chunks = ['they take']
    if(def.damage.scaledNumber){
      chunks.push(statScaling(def.damage.scaledNumber, abilityInstance))
    }
    chunks.push(`${def.damageType ?? 'phys'} damage per second`)
    return chunks.join(' ')
  }
}