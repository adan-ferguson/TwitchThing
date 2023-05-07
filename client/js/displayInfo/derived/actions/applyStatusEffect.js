import { statusEffectDescription } from '../../statusEffectDisplayInfo.js'

export function derivedApplyStatusEffectDescription(actionDef, abilityInstance){
  const sed = statusEffectDescription(actionDef.statusEffect)
  const chunks = [actionDef.affects === 'self' ? 'Gain' : 'Enemy gains']
  chunks.push(...sed.chunks)
  return chunks
}