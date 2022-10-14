import { BUFF_COLOR, DEBUFF_COLOR } from './colors.js'
import { poisonedStatusEffect } from '../../game/statusEffects/combined.js'

export function effectDisplayInfo(effect){

  let text = `${effect.displayName}`
  if(effect.stacks >= 2){
    text += ` x${effect.stacks}`
  }

  const intDuration = parseInt(effect.duration) || null
  const color = effect.isBuff ? BUFF_COLOR : DEBUFF_COLOR
  const barMax = intDuration ?? 1
  const barValue = intDuration ? (intDuration - effect.state.time) : 1
  const tooltip = makeTooltip(effect)

  return {
    text,
    barValue,
    barMax,
    color,
    tooltip
  }
}

function makeTooltip(effect){
  if(effect.effectData.name === poisonedStatusEffect.name){
    return `Taking ${effect.effectData.params.dps * effect.stacks} magic damage per second`
  }
  return 'No Tooltip LOL'
}