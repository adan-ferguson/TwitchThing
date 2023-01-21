import { makeActionResult } from '../../game/actionResult.js'
import { expandStatusEffectsDef } from '../../game/statusEffectsData.js'
import { triggerEvent } from './common.js'

export function performStatusEffectAction(combat, sourceEffect, actionDef){
  const actor = sourceEffect.owner
  const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  const resultObj = {
    type: 'gainEffect',
    triggeredEvents: [],
    subject: subject.uniqueID
  }

  if(subject !== actor){
    resultObj.triggeredEvents.push(...triggerEvent(combat, subject, 'targeted'))
    if(resultObj.triggeredEvents.at(-1)?.cancelled){
      resultObj.cancelled = true
      return makeActionResult(resultObj)
    }
  }

  resultObj.data = addStatusEffect(combat, sourceEffect, subject, actionDef.effect)
  return makeActionResult(resultObj)
}

export function performRemoveStatusEffectAction(combat, actor, actionDef){
  const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  const resultObj = {
    type: 'removeEffect',
    triggeredEvents: [],
    subject: subject.uniqueID
  }

  if(subject !== actor){
    resultObj.triggeredEvents.push(...triggerEvent(combat, subject, 'targeted'))
    if(resultObj.triggeredEvents.at(-1)?.cancelled){
      resultObj.cancelled = true
      return makeActionResult(resultObj)
    }
  }

  const candidateEffects = subject.statusEffectsData.instances.filter(sei => {
    return sei.isBuff === actionDef.isBuff && !sei.expired && !sei.phantom
  })

  let sliceVal = undefined
  if(actionDef.count !== 'all'){
    if(actionDef.order === 'newest'){
      sliceVal = actionDef.count * -1
    }else if (actionDef.order === 'oldest'){
      sliceVal = actionDef.count
    }
  }
  const toRemove = candidateEffects.slice(sliceVal)
  subject.statusEffectsData.remove(toRemove)
  resultObj.data = {
    removed: toRemove.map(instance => instance.id)
  }

  return makeActionResult(resultObj)
}

/**
 * @param combat
 * @param sourceEffect
 * @param subject
 * @param def
 */
export function addStatusEffect(combat, sourceEffect, subject, def){
  const data = expandStatusEffectsDef(sourceEffect, def)
  data.sourceEffectId = sourceEffect.effectId
  subject.statusEffectsData.add(data)
  return data
}