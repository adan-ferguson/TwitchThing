import scaledValue from './scaledValue.js'

export default class LevelCalculator{

  static xpToLevel(level2xp, xpMultiplier, xp){
    let lvl = 1
    while(xp >= LevelCalculator.levelToXp(level2xp, xpMultiplier, lvl + 1)){
      lvl++
    }
    return lvl
  }

  static levelToXp(level2xp, xpMultiplier, lvl){

    if(lvl <= 0){
      return 0
    }

    let xp = level2xp
    for(let i = 1; i < lvl; i++){
      xp += scaledValue(xpMultiplier, i - 1, level2xp)
      xp = toThreeDigits(xp)
    }
    return xp

    function toThreeDigits(x){
      x = Math.ceil(x)
      if(x < 1000){
        return x
      }
      x = x + ''
      const divisor = Math.pow(10, x.length - 3)
      return Math.ceil(x / divisor) * divisor
    }
  }
}