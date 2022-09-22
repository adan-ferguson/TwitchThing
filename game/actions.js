export function attackAction(def){
  return {
    damageType: 'phys',
    damageMulti: 1,
    ...def,
    type: 'attack',
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
    throw 'Effect action is missing an effect'
  }

  if(!action.effect.name){
    throw 'Effect is missing a name'
  }

  return action
}