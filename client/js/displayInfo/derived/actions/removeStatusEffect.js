export function derivedRemoveStatusEffectDescription(def){
  return `Remove all ${def.polarity}s from ${def.targets === 'self' ? 'yourself' : 'the enemy'}.`
}