import Stats from './stats/stats.js'
import LevelCalculator from './levelCalculator.js'
import Item from './item.js'

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
 * @param loadout
 * @returns {Stats}
 */
export function getStats(adventurer, loadout = adventurer.loadout){
  const loadoutStats = loadout.filter(itemDef => itemDef).map(itemDef => {
    const item = new Item(itemDef)
    return item.stats
  })
  return new Stats([adventurer.baseStats, ...loadoutStats])
}

/**
 * @param adventurer
 * @param state
 * @returns {Stats}
 */
export function getActiveStats(adventurer, state = {}){
  const stats = getStats(adventurer)
  // TODO: add affectors from the state
  return new Stats([...stats.affectors])
}