import { all as Effects } from '../../game/statusEffects/combined.js'
import { makeActionResult } from '../../game/actionResult.js'
import { expandStatusEffectsDef } from '../../game/statusEffectsData.js'

export function performStatusEffectAction(combat, actor, actionDef){
  const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  return makeActionResult({
    type: 'gainEffect',
    data: addStatusEffect(combat, actor, subject, actionDef.effect),
    subject: subject.uniqueID
  })
}

export function performRemoveStatusEffectAction(combat, actor, actionDef){
  const subject = actionDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
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

  return makeActionResult({
    type: 'removeEffect',
    data: {
      removed: toRemove.map(instance => instance.id)
    },
    subject: subject.uniqueID
  })
}

/**
 * @param combat
 * @param actor
 * @param subject
 * @param def
 */
export function addStatusEffect(combat, actor, subject, def){
  const data = expandStatusEffectsDef(actor, def)
  subject.statusEffectsData.add(data)
  return data
}