import { deepClone } from '../../game/utilFunctions.js'
import { scaledNumberFromAbilityInstance } from '../../game/scaledNumber.js'
import { chooseOne } from '../../game/rando.js'
import StatusEffectInstance from '../../game/baseEffects/statusEffectInstance.js'
import { processAbilityEvents } from './abilities.js'
import { blockBarrierAction } from '../../game/commonMechanics/blockBarrierAction.js'
import { performAction } from './actions/performAction.js'

const DIMINISHING_RETURNS_STATUS_EFFECT = {
  polarity: 'neutral',
  name: 'diminishingReturns',
  stacking: 'stack',
  stackingId: 'diminishingReturns',
  stats: {
    ccResist: '25%'
  }
}

export function gainStatusEffect(combat, source, subject, abilityInstance, statusEffectData){

  const convertedStatusEffect = convertStatusEffectParams(
    statusEffectData,
    abilityInstance,
    subject
  )

  let statusEffectInstance = new StatusEffectInstance(convertedStatusEffect, subject)

  let ret = {}
  if(statusEffectInstance.polarity === 'debuff'){
    ret = processAbilityEvents(combat, 'gainingDebuff', subject, abilityInstance, ret, {})
  }

  if(ret.cancelled){
    return ret
  }

  if(statusEffectInstance.diminishingReturns && statusEffectInstance.duration){
    statusEffectInstance = applyDiminishingReturns(statusEffectInstance)
    gainStatusEffect(combat, subject, subject, null, DIMINISHING_RETURNS_STATUS_EFFECT)
  }

  applyStatusEffect(subject, statusEffectInstance, abilityInstance)
}

function applyDiminishingReturns(statusEffectInstance){
  const ccr = statusEffectInstance.fighterInstance.totalStats.get('ccResist').value
  const newDuration = statusEffectInstance.duration * (1 - ccr)
  const newData = statusEffectInstance.data
  newData.duration = newDuration
  return new StatusEffectInstance(newData, statusEffectInstance.fighterInstance)
}

function applyStatusEffect(subject, sei, abilityInstance){

  const sourceEffectId = abilityInstance?.parentEffect.uniqueID ?? null

  if(sei.stacking){
    const existing = subject.statusEffectInstances.find(sei2 => {
      if(sei.stackingId){
        return sei.stackingId === sei2.stackingId
      }
      return sourceEffectId && sourceEffectId === sei2.sourceEffectId
    })
    if(existing){
      const durationRemainingBefore = existing.durationRemaining
      existing.replaceData(sei.data)
      if(existing.stacking === 'replace'){
        existing.refresh()
      }else if(existing.stacking === 'extend'){
        existing.extend(durationRemainingBefore)
      }else if(existing.stacking === 'stack'){
        existing.modifyStacks(1).refresh()
      }
      return
    }
  }

  subject.addStatusEffect(sei.data, {
    sourceEffectId
  })
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