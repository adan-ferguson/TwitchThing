import { toNumberOfDigits } from './utilFunctions.js'

const BASE_GROWTH = 3
const GROWTH_FACTOR = 0.12
const FLAT_FACTOR = 0.1
const COUNT = 1000

const vals = []

export default {
  xpToLevel(xp){
    return bsearch(xp)
  },
  levelToXp(level){
    return vals[level] ?? 0
  }
}

let flatFactor = 1
let current = 0
let nextGrowth = BASE_GROWTH
let growthGrowth = BASE_GROWTH
for(let lvl = 0; lvl < COUNT; lvl++){
  flatFactor += flatFactorAdd(lvl)
  vals[lvl] = current
  current = toNumberOfDigits(Math.floor(current + nextGrowth * flatFactor), 3)
  nextGrowth += growthGrowth
  growthGrowth *= (1 + GROWTH_FACTOR)
}

function bsearch(xp, start = 0, end = COUNT - 1){
  if(start === end){
    return start
  }
  const mid = Math.floor((start + end)/2)
  if(xp >= vals[mid] && xp < vals[mid + 1]){
    return mid
  }else if(xp < vals[mid]){
    return bsearch(xp, start, mid - 1)
  }else{
    return bsearch(xp, mid + 1, end)
  }
}

function flatFactorAdd(lvl){
  if(lvl < 3){
    return 0
  }else if(lvl < 11){
    return FLAT_FACTOR
  }else if(lvl < 31){
    return FLAT_FACTOR * 1.75
  }else{
    return FLAT_FACTOR / 2
  }
}