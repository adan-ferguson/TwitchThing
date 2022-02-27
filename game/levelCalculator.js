export default class LevelCalculator{

  constructor(level2xp, xpMultiplier){
    this.level2xp = level2xp
    this.xpMultiplier = xpMultiplier
  }

  xpToLevel(xp){
    let lvl = 1
    while(xp >= this.levelToXp(lvl + 1)){
      lvl++
    }
    return lvl
  }

  levelToXp(lvl){

    let xp = 0
    let nextXp = this.level2xp
    for(let i = 1; i < lvl; i++){
      xp += nextXp
      xp = toThreeDigits(xp)
      nextXp *= this.xpMultiplier
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