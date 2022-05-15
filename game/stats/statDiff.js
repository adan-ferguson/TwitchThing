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
export function calcStatDiff({ defaultValue, baseValue, value, inverted = false }){
  if(baseValue === value){
    return StatDiff.NONE
  }
  if(baseValue === defaultValue){
    return inv(value > defaultValue) ? StatDiff.NEW_BUFF : StatDiff.NEW_DEBUFF
  }else{
    return inv(value > baseValue) ? StatDiff.BUFF : StatDiff.DEBUFF
  }

  function inv(bool){
    return inverted ? !bool: bool
  }
}