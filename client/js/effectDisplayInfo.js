import { STATUSEFFECT_COLORS } from './colors.js'
import { getAbilityStateInfo } from './abilityStateInfo.js'

export function effectDisplayInfo(effectInstance){

  debugger
  let text = `${effectInstance.displayName}`
  if(effectInstance.stacks >= 2){
    text += ` x${effectInstance.stacks}`
  }
  if(effectInstance.barrier){
    text += ` ${Math.ceil(effectInstance.barrierPointsRemaining)}`
  }

  const colors = getColors(effectInstance)

  let barMax = 1
  let barValue = 1
  if(effectInstance.duration){
    barMax = effectInstance.duration
    barValue = effectInstance.durationRemaining
  }else if(effectInstance.barrier){
    barMax = effectInstance.barrier.points
    barValue = effectInstance.barrierPointsRemaining
  }

  return {
    text,
    barValue,
    barMax,
    colors,
    abilityStateInfo: getAbilityStateInfo(effectInstance),
    animateChanges: effectInstance.duration ? false : true
  }
}

function getColors(effectInstance){
  if(effectInstance.barrier){
    return STATUSEFFECT_COLORS.barrier
  }
  return STATUSEFFECT_COLORS[effectInstance.isBuff ? 'buff' : 'debuff']
}