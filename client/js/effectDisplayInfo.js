import { STATUSEFFECT_COLORS } from './colors.js'
import AbilityDisplayInfo from './abilityDisplayInfo.js'

export function effectDisplayInfo(effectInstance){

  let text = `${effectInstance.displayName}`
  if(effectInstance.stacks >= 2){
    text += ` x${effectInstance.stacks}`
  }
  if(effectInstance.barrier){
    text += ` ${Math.ceil(effectInstance.barrierPointsRemaining)}`
  }

  const colors = getColors(effectInstance)

  let barPct = 1
  if(effectInstance.duration){
    barPct = effectInstance.durationRemaining / effectInstance.duration
  }else if(effectInstance.barrier){
    barPct = effectInstance.barrierPointsRemaining / effectInstance.barrier.points
  }

  const abilityDisplayInfo = new AbilityDisplayInfo(effectInstance)

  return {
    text,
    barPct,
    miniBarPct: abilityDisplayInfo.barPct,
    colors,
    animateChanges: effectInstance.duration ? false : true
  }
}

function getColors(effectInstance){
  if(effectInstance.barrier){
    return STATUSEFFECT_COLORS.barrier
  }
  return STATUSEFFECT_COLORS[effectInstance.isBuff ? 'buff' : 'debuff']
}