export const StatDiff = {
  NONE: 0,        // Base and total are the same
  BUFF: 1,        // Positive effect
  DEBUFF: 2,       // Negative effect
  NEW_BUFF: 3,    // Positive effect, plus no base value
  NEW_DEBUFF: 4   // Negative effect, plus no base value
}

/**
 * Gets a StatDiff value.
 * @param defaultValue {number}
 * @param baseValue {number}
 * @param totalValue {number}
 * @return {number} A StatDiff.[something] value.
 */
export function calcStatDiff(defaultValue, baseValue, totalValue){
  if(baseValue === totalValue){
    return StatDiff.NONE
  }
  if(baseValue === defaultValue){
    return totalValue > defaultValue ? StatDiff.NEW_BUFF : StatDiff.NEW_DEBUFF
  }else{
    return totalValue > baseValue ? StatDiff.BUFF : StatDiff.DEBUFF
  }
}