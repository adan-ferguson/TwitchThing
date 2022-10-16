import { STATUSEFFECT_COLORS } from './colors.js'
import { poisonedStatusEffect } from '../../game/statusEffects/combined.js'

export function effectDisplayInfo(effectInstance){

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

  const tooltip = makeTooltip(effectInstance)

  return {
    text,
    barValue,
    barMax,
    colors,
    tooltip,
    animateChanges: effectInstance.duration ? false : true
  }
}

function makeTooltip(effect){
  if(effect.effectData.name === poisonedStatusEffect.name){
    return `Taking ${effect.effectData.params.dps * effect.stacks} magic damage per second`
  }
  return 'No Tooltip LOL'
}

function getColors(effectInstance){
  return STATUSEFFECT_COLORS[effectInstance.isBuff ? 'buff' : 'debuff']
}