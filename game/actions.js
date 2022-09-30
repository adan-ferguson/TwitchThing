export function attackAction(def){
  return {
    damageType: 'phys',
    damageMulti: 1,
    ...def,
    type: 'attack',
  }
}

export function selfDamageAction(def){
  return {
    damageType: 'phys',
    amount: 0,
    ...def,
    type: 'damage'
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