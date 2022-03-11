import Stats from './stats/stats.js'
import LevelCalculator from './levelCalculator.js'

const LEVEL_2_XP = 100
const XP_MULTIPLIER = 0.25
const calc = new LevelCalculator(LEVEL_2_XP, XP_MULTIPLIER)

export function xpToLevel(xp){
  return calc.xpToLevel(xp)
}

export function levelToXp(lvl){
  return calc.levelToXp(lvl)
}

/**
 * @param adventurer
 * @returns {Stats}
 */
export function getStats(adventurer){
  return new Stats([adventurer.baseStats])
}

/**
 * @param adventurer
 * @param state
 * @returns {Stats}
 */
export function getActiveStats(adventurer, state = {}){
  return new Stats([adventurer.baseStats])
}