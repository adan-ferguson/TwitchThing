export function attackAction(def){
  return {
    type: 'attack',
    damageType: 'phys',
    damageMulti: 1,
    ...def
  }
}

/**
 * An effect action grant one or both fighters an effect.
 * @param effect
 */
export function effectAction(effect){
  return {
    type: 'effect',
    affects: 'self', //'enemy'|'both'
    effect
  }
}