import { STATUSEFFECT_COLORS } from './colors.js'
import AbilityDisplayInfo from './abilityDisplayInfo.js'

export function effectDisplayInfo(effectInstance){

  let text = `${effectInstance.displayName}`
  if(effectInstance.stacks >= 2){
    text += ` x${effectInstance.stacks}`
  }

  const colors = getColors(effectInstance)

  let barValue = 1, barMax = 1, showValue = false
  if(effectInstance.duration){
    barValue = effectInstance.durationRemaining
    barMax = effectInstance.duration
  }else if(effectInstance.barrier){
    barValue = effectInstance.barrierPointsRemaining
    barMax = effectInstance.barrier.points
    showValue = true
  }

  const abilityDisplayInfo = new AbilityDisplayInfo(effectInstance)

  return {
    text,
    barValue,
    barMax,
    miniBarPct: abilityDisplayInfo.barPct,
    colors,
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