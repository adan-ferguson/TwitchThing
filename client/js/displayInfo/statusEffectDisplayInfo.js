import { STATUSEFFECT_COLORS } from '../colors.js'
import { effectInstanceState } from '../effectInstanceState.js'

export function statusEffectDisplayInfo(effectInstance){

  let text = `${effectInstance.displayName}`
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

function getColors(effectInstance){
  if(effectInstance.barrier){
    return STATUSEFFECT_COLORS.barrier
  }
  return STATUSEFFECT_COLORS[effectInstance.isBuff ? 'buff' : 'debuff']
}