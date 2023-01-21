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