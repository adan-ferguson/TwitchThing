import { all as Effects } from '../../game/statusEffects/combined.js'
import { makeActionResult } from '../../game/actionResult.js'

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
  const candidateEffects = subject.statusEffectsData.instances.forEach(sei => {
    return sei.buff === actionDef.buff
  })
  const toRemove = actionDef.count === 'all' ? candidateEffects : candidateEffects.slice(-actionDef.count)
  subject.remvo

  return makeActionResult({
    type: 'removeEffect',
    data: {

    },
    subject: subject.uniqueID
  })
}

/**
 * @param combat
 * @param actor
 * @param subject
 * @param statusEffectData
 */
export function addStatusEffect(combat, actor, subject, statusEffectData){
  if(statusEffectData.name){
    const baseEffect = Effects[statusEffectData.name]
    if(baseEffect.stateParamsFn){
      statusEffectData = {
        ...statusEffectData,
        params: baseEffect.stateParamsFn({
          source: actor,
          params: statusEffectData.params
        })
      }
    }
  }
  subject.statusEffectsData.add(statusEffectData)
  return statusEffectData
}