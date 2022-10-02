import { all as Effects } from '../../game/statusEffects/combined.js'

/**
 * @param combat
 * @param actor
 * @param subject
 * @param statusEffectData
 */
export function applyStatusEffect(combat, actor, subject, statusEffectData){
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
  subject.statusEffectsData.add(statusEffectData)
  return statusEffectData
}