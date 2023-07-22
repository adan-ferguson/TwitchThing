import { toNumberOfDigits } from './utilFunctions.js'

const BASE_GROWTH = 3
const GROWTH_FACTOR = 0.12
const FLAT_FACTOR = 0.1
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
    return this._vals[lvl] ?? 0
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
  let factor = 1
  if(lvl > 2){
    // double speed growth between 3-30
    factor += (lvl - 2) * FLAT_FACTOR
    if(lvl > 10){
      factor += (lvl - 10) * FLAT_FACTOR
    }
    if(lvl > 30){
      factor -= (lvl - 30) * FLAT_FACTOR
    }
  }
  return factor
}