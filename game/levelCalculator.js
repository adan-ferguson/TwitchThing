import ScaledValue from './scaledFactor.js'

export default class LevelCalculator{

  constructor(level2xp, xpMultiplier){
    this.level2xp = level2xp
    this.xpMultiplier = xpMultiplier

    const vals = []
    for(let i = 0; i <= 50; i++){
      vals[i] = this.levelToXp(i)
    }
    return vals
  }

  xpToLevel(xp){
    let lvl = 1
    while(xp >= this.levelToXp(lvl + 1)){
      lvl++
    }
    return lvl
  }

  levelToXp(lvl){

    if(lvl <= 1){
      return 0
    }

    let xp = this.level2xp
    let scaledValue = new ScaledValue(this.xpMultiplier)
    for(let i = 2; i < lvl; i++){
      xp += this.level2xp * scaledValue.getVal(i - 1)
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