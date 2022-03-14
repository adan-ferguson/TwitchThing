import LevelCalculator from './levelCalculator.js'

const LEVEL_2_XP = 200
const XP_MULTIPLIER = 0.3
const calc = new LevelCalculator(LEVEL_2_XP, XP_MULTIPLIER)

export function xpToLevel(xp){
  return calc.xpToLevel(xp)
}

export function levelToXp(lvl){
  return calc.levelToXp(lvl)
}

export function levelToAdventurerSlots(lvl){
  return 1 + Math.floor(lvl / 10)
}