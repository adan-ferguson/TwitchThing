import { statusEffectDescription } from '../../statusEffectDisplayInfo.js'

export function derivedApplyStatusEffectDescription(actionDef, abilityInstance){
  const sed = statusEffectDescription(actionDef.statusEffect)
  const chunks = [actionDef.affects === 'self' ? 'Get' : 'Enemy gets']
  chunks.push(...sed.chunks)
  chunks[chunks.length - 1] += '.'
  return chunks
}