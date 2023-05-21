import { statusEffectApplicationDescription } from '../../statusEffectDisplayInfo.js'

export function derivedApplyStatusEffectDescription(actionDef, abilityInstance){
  const chunks = []
  if(actionDef.affects !== 'self'){
    chunks.push('they')
  }
  chunks.push(...statusEffectApplicationDescription(actionDef.statusEffect, abilityInstance))
  chunks[chunks.length - 1] += '.'
  return chunks
}