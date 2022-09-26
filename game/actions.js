export function attackAction(def){
  return {
    damageType: 'phys',
    damageMulti: 1,
    ...def,
    type: 'attack',
  }
}

/**
 * Adjusts a user's next action time bar
 * @param ms
 * @returns {{ms, type: string}}
 */
export function timeAdjustmentAction(ms){
  return {
    type: 'time',
    ms
  }
}

/**
 * An effect action grant one or both fighters an effect.
 * @param effect
 * @param options
 */
export function effectAction(effect, options = {}){
  const action = {
    affects: 'self', // 'enemy' | 'both'
    effect: {},
    ...options,
    type: 'effect',
  }
  action.effect.name = effect.name
  return action
}