import Stats from './stats/stats.js'
import LevelCalculator from './levelCalculator.js'
import Item from './item.js'
import scaledValue from './scaledValue.js'

const LEVEL_2_XP = 100
const XP_MULTIPLIER = 0.4

const HP_BASE = 100
const HP_GROWTH_PCT = 0.1
const POWER_BASE = 10
const POWER_GROWTH_PCT = 0.1

export function xpToLevel(xp){
  return LevelCalculator.xpToLevel(LEVEL_2_XP, XP_MULTIPLIER, xp)
}

export function levelToXp(lvl){
  return LevelCalculator.levelToXp(LEVEL_2_XP, XP_MULTIPLIER, lvl)
}

export function levelToHp(lvl){
  return Math.ceil(scaledValue(HP_GROWTH_PCT, lvl, HP_BASE))
}

export function levelToPower(lvl){
  return Math.ceil(scaledValue(POWER_GROWTH_PCT, lvl, POWER_BASE))
}

/**
 * @param adventurer
 * @param items [itemDef]
 * @param bonus
 * @returns {Stats}
 */
export function getIdleAdventurerStats({ adventurer, items = adventurer.items, bonus = [] }){
  const loadoutStats = items.filter(itemDef => itemDef).map(itemDef => {
    const item = new Item(itemDef)
    return item.stats
  })
  return new Stats([adventurer.baseStats, ...loadoutStats], bonus.affectors)
}