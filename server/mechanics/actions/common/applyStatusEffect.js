import { gainStatusEffect } from '../../gainStatusEffect.js'
import ParamFns from '../../statusEffectParams/combined.js'

// base: {
//   damageOverTime: {
//   }
// },
// name: 'poisoned',
//   duration: 10000,
//   persisting: true,

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
    const baseName = Object.keys(statusEffect.base)[0]
    if(ParamFns[baseName]){
      const newVal = ParamFns[baseName].def(statusEffect.base[baseName], abilityInstance)
      return {
        ...statusEffect,
        base: {
          [baseName]: newVal
        }
      }
    }
  }
  return statusEffect
}