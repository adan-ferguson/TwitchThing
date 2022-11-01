import { exponentialValue } from './exponentialValue.js'
import { toNumberOfDigits } from './utilFunctions.js'

export default class LevelCalculator{

  static xpToLevel(level2xp, xpMultiplier, xp){
    let lvl = 1
    while(xp >= LevelCalculator.levelToXp(level2xp, xpMultiplier, lvl + 1)){
      lvl++
    }
    return lvl
  }

  static levelToXp(level2xp, xpMultiplier, lvl){

    if(lvl <= 1){
      return 0
    }

    let xp = level2xp
    for(let i = 2; i < lvl; i++){
      xp += exponentialValue(xpMultiplier, i - 2, level2xp)
      xp = toNumberOfDigits(xp, 3)
    }
    return xp
  }
}