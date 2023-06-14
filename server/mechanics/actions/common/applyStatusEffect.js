import { gainStatusEffect } from '../../gainStatusEffect.js'
import { scaledNumberFromAbilityInstance } from '../../../../game/scaledNumber.js'
import { processAbilityEvents } from '../../abilities.js'
import { explodeEffect } from '../../../../game/baseEffects/statusEffectInstance.js'
import { chooseOne } from '../../../../game/rando.js'
import { deepClone } from '../../../../game/utilFunctions.js'

export default function(combat, actor, subject, abilityInstance, actionDef = {}){
  const statusEffect = convertStatusEffectParams(actionDef.statusEffect, abilityInstance, subject)
  const exploded = explodeEffect(statusEffect)
  let ret = {
    statusEffect
  }
  if(exploded.polarity === 'debuff'){
    ret = processAbilityEvents(combat, 'gainingDebuff', subject, abilityInstance, ret)
  }
  if(!ret.cancelled){
    const ccr = subject.totalStats.get('stunResist').value
    let addCcrStack = false
    if(statusEffect.base?.stunned && actor !== subject){
      statusEffect.base.stunned.duration *= 1 - ccr
      addCcrStack = true
    }
    gainStatusEffect(combat, subject, abilityInstance, statusEffect)
    if(addCcrStack){
      gainStatusEffect(combat, subject, null, {
        polarity: 'neutral',
        name: 'CCR',
        stacking: 'stack',
        maxStacks: 5,
        stats: {
          stunResist: '33%'
        }
      })
    }
  }
  return ret
}

function convertStatusEffectParams(statusEffect, abilityInstance, subject){
  statusEffect = deepClone(statusEffect)
  if(statusEffect.base){
    for(let baseKey in statusEffect.base){
      let base = statusEffect.base[baseKey]
      if(!base){
        return
      }
      for(let key in base){
        if(base[key].scaledNumber){
          base[key] = scaledNumberFromAbilityInstance(abilityInstance, base[key].scaledNumber)
        }
        if(key === 'replaceMe'){
          base = { ...base, ...replace(base.replaceMe, subject) }
          delete base.replaceMe
        }
      }
      statusEffect.base[baseKey] = base
    }
  }
  return statusEffect
}

function replace(replacementInstruction, subject){
  if(replacementInstruction === 'randomItemSlotInfo'){
    return {
      col: 0,
      row: chooseOne(getFilledSlots(subject, 0))
    }
  }
  throw 'Unknown replacement instruction'
}

function getFilledSlots(subject, col = 0){
  return subject.loadoutEffectInstances.filter(lei => lei.slotInfo.col === col).map(lei => lei.slotInfo.row)
}