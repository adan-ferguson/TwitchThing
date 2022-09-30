import { all as Effects } from '../../game/statusEffects/combined.js'

/**
 * An effect action grant one or both fighters an effect.
 * @param effectDef {object} Effects.<something>
 * @param options
 */
// export function statusEffectAction(effectDef, options = {}){
//   const affects = options.affects ?? 'self'
//   return (combat, actor) => {
//     const subject = affects === 'self' ? actor : combat.getEnemyOf(actor)
//     const statusEffectInstance = applyStatusEffect({
//       effectDef,
//       combat,
//       source: actor,
//       subject,
//       options: options.effect
//     })
//     return [{
//       resultType: 'gainEffect',
//       effect: effect.data,
//       subject: subject.uniqueID
//     }]
//   }
// }

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
      params: baseEffect.stateParamsFn(actor, statusEffectData.params)
    }
  }
  subject.statusEffectsData.add(statusEffectData)
}