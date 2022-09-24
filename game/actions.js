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
 * @param options
 */
export function effectAction(options = {}){
  const action = {
    affects: 'self', // 'enemy' | 'both'
    ...options,
    type: 'effect',
  }

  if(!action.effect){
    console.error('Effect action is missing an effect', action)
  }

  if(!action.effect.id){
    console.error('Effect is missing an id', action)
  }

  return action
}