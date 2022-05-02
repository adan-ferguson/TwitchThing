import scaledValue from './scaledValue.js'

export default class LevelCalculator{

  constructor(level1xp, xpMultiplier){
    this.level1xp = level1xp
    this.xpMultiplier = xpMultiplier
  }

  xpToLevel(xp){
    let lvl = 0
    while(xp >= this.levelToXp(lvl + 1)){
      lvl++
    }
    return lvl
  }

  levelToXp(lvl){

    if(lvl <= 0){
      return 0
    }

    let xp = this.level1xp
    for(let i = 1; i < lvl; i++){
      xp += scaledValue(this.xpMultiplier, i, this.level1xp)
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