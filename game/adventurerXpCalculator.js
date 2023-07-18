import { toNumberOfDigits } from './utilFunctions.js'

const BASE_GROWTH = 3
const GROWTH_FACTOR = 0.12
const COUNT = 1000

export default class AdventurerXpCalculator{
  constructor(){
    this._vals = []
    let current = 0
    let nextGrowth = BASE_GROWTH
    let growthGrowth = BASE_GROWTH
    for(let i = 1; i < COUNT; i++){
      const growthMultiplier = growthMulti(i)
      this._vals[i] = current
      current = toNumberOfDigits(Math.floor(current + nextGrowth * growthMultiplier), 3)
      nextGrowth += growthGrowth
      growthGrowth *= (1 + GROWTH_FACTOR)
    }
  }

  xpToLevel(xp){
    return this._bsearch(xp)
  }

  levelToXp(lvl){
    return this._vals[lvl]
  }

  _bsearch(xp, start = 0, end = COUNT - 1){
    if(start === end){
      return start
    }
    const mid = Math.floor((start + end)/2)
    if(xp >= this._vals[mid] && xp < this._vals[mid + 1]){
      return mid
    }else if(xp < this._vals[mid]){
      return this._bsearch(xp, start, mid - 1)
    }else{
      return this._bsearch(xp, mid + 1, end)
    }
  }
}

function growthMulti(lvl){
  if(lvl < 10){
    return 1
  }else{
    return 1 + (lvl - 10) * 0.2
  }
}