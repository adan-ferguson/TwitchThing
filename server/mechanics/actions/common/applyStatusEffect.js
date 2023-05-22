import { gainStatusEffect } from '../../gainStatusEffect.js'
import { scaledNumberFromAbilityInstance } from '../../../../game/scaledNumber.js'
import { processAbilityEvents } from '../../abilities.js'

export default function(combat, actor, abilityInstance, actionDef = {}){
  const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  const statusEffect = convertStatusEffectParams(actionDef.statusEffect, abilityInstance)
  let ret = {
    subject: subject.uniqueID,
    statusEffect
  }
  if(statusEffect.polarity === 'debuff'){
    debugger
    ret = processAbilityEvents(combat, 'gainingDebuff', subject, abilityInstance, ret)
  }
  if(!ret.cancelled){
    gainStatusEffect(combat, subject, abilityInstance, statusEffect)
  }
  return ret
}

function convertStatusEffectParams(statusEffect, abilityInstance){
  if(statusEffect.base){
    const base = Object.values(statusEffect.base)[0]
    if(!base){
      return
    }
    for(let key in base){
      if(base[key].scaledNumber){
        base[key] = scaledNumberFromAbilityInstance(abilityInstance, base[key].scaledNumber)
      }
    }
  }
  return statusEffect
}