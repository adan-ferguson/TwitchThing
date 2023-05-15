import { gainStatusEffect } from '../../gainStatusEffect.js'
import { scaledNumberFromAbilityInstance } from '../../../../game/scaledNumber.js'

export default function(combat, actor, abilityInstance, actionDef = {}){
  const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  const statusEffect = convertStatusEffectParams(actionDef.statusEffect, abilityInstance)
  const ret = {
    subject: subject.uniqueID,
    statusEffect
  }
  gainStatusEffect(combat, subject, abilityInstance, statusEffect)
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