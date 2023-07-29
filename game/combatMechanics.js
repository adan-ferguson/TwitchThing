const OVERTIME_BONUS = 1.03

export function overtimeDamageBonus(msOvertime){
  if(msOvertime < 0){
    return 1
  }
  const seconds = Math.floor(msOvertime / 1000)
  return Math.pow(OVERTIME_BONUS, seconds)
}