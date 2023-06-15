import { deepClone } from '../../game/utilFunctions.js'
import { scaledNumberFromAbilityInstance } from '../../game/scaledNumber.js'
import { chooseOne } from '../../game/rando.js'
import StatusEffectInstance from '../../game/baseEffects/statusEffectInstance.js'
import { processAbilityEvents } from './abilities.js'

const STUN_RESIST_STATUS_EFFECT = {
  polarity: 'neutral',
  name: 'stunResist',
  stacking: 'stack',
  maxStacks: 5,
  stats: {
    stunResist: '33%'
  }
}

export function gainStatusEffect(combat, source, subject, abilityInstance, statusEffectData){

  const convertedStatusEffect = convertStatusEffectParams(
    statusEffectData,
    abilityInstance,
    subject
  )

  const statusEffectInstance = new StatusEffectInstance(convertedStatusEffect, subject)

  let ret = {}
  if(statusEffectInstance.polarity === 'debuff'){
    ret = processAbilityEvents(combat, 'gainingDebuff', subject, abilityInstance, ret)
  }

  if(ret.cancelled){
    return ret
  }

  const appliedStunResist = applyStunResist(source, subject, statusEffectData)
  applyStatusEffect(subject, convertedStatusEffect, abilityInstance)

  if(appliedStunResist){
    gainStatusEffect(combat, subject, subject, null, STUN_RESIST_STATUS_EFFECT)
  }
}

function applyStunResist(source, subject, statusEffect){
  const ccr = subject.totalStats.get('stunResist').value
  if (statusEffect.base?.stunned && source !== subject){
    statusEffect.base.stunned.duration *= 1 - ccr
    return true
  }
  return false
}

function applyStatusEffect(subject, statusEffectData, abilityInstance){

  const state = {
    sourceEffectId: abilityInstance?.parentEffect.uniqueID ?? null
  }

  if(statusEffectData.stacking){
    const existing = subject.statusEffectInstances.find(sei => {
      if(statusEffectData.stackingId){
        return statusEffectData.stackingId === sei.stackingId
      }
      return state.sourceEffectId === sei.sourceEffectId
    })
    if(existing){
      const durationRemainingBefore = existing.durationRemaining
      existing.replaceData(statusEffectData)
      if(existing.stacking === 'replace'){
        existing.refresh()
      }else if(existing.stacking === 'extend'){
        existing.extend(durationRemainingBefore)
      }else if(existing.stacking === 'stack'){
        existing.addStack()
      }
      return
    }
  }

  subject.addStatusEffect(statusEffectData, state)
}

export function gainBlockBarrier(combat, subject, multiplier = 1){
  const block = subject.stats.get('block').value
  if(block){
    gainStatusEffect(combat, subject, null, {
      stackingId: 'block',
      polarity: 'buff',
      stacking: 'replace',
      name: 'block',
      barrier: {
        hp: Math.ceil(subject.hpMax * block) * multiplier
      }
    })
  }
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