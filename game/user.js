const LEVEL_2_XP = 200
const XP_MULTIPLIER = 1.3

export function xpToLevel(xp) {
  let lvl = 1
  while(xp >= levelToXp(lvl + 1)){
    lvl++
  }
  return lvl
}

/**
 * lvl. 1 = 0
 * lvl. 2 = LEVEL_2_XP
 * and so on
 * @param lvl
 * @returns {number}
 */
export function levelToXp(lvl){
  let xp = 0
  let nextXp = LEVEL_2_XP
  for(let i = 1; i < lvl; i++){
    xp += nextXp
    xp = toThreeDigits(xp)
    nextXp *= XP_MULTIPLIER
  }
  return xp

  function toThreeDigits(x){
    x = Math.ceil(x)
    if(x < 1000){
      return x
    }
    x = x + ''
    return parseInt(x.substring(0,3) + x.substring(3).replace(/g/, 0))
  }
}