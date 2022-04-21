import LevelCalculator from './levelCalculator.js'

const LEVEL_1_XP = 100
const XP_MULTIPLIER = 0.50
const calc = new LevelCalculator(LEVEL_1_XP, XP_MULTIPLIER)

export function xpToLevel(xp){
  return calc.xpToLevel(xp)
}

export function levelToXp(lvl){
  return calc.levelToXp(lvl)
}

export function levelToAdventurerSlots(lvl){
  return 1 + Math.floor(lvl / 10)
}