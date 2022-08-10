import Stats from './stats/stats.js'
import LevelCalculator from './levelCalculator.js'
import scaledValue from './scaledValue.js'
import OrbsData from './orbsData.js'
import ModsCollection from './modsCollection.js'
import Bonus from './bonus.js'
import ItemInstance from './item.js'

const LEVEL_2_XP = 100
const XP_MULTIPLIER = 0.33

const HP_BASE = 50
const HP_GROWTH_PCT = 0.12
const POWER_BASE = 10
const POWER_GROWTH_PCT = 0.1

export function xpToLevel(xp){
  return LevelCalculator.xpToLevel(LEVEL_2_XP, XP_MULTIPLIER, xp)
}

export function levelToXp(lvl){
  return LevelCalculator.levelToXp(LEVEL_2_XP, XP_MULTIPLIER, lvl)
}

export function adventurerLevelToHp(lvl){
  return Math.ceil(scaledValue(HP_GROWTH_PCT, lvl - 1, HP_BASE))
}

export function adventurerLevelToPower(lvl){
  return Math.ceil(scaledValue(POWER_GROWTH_PCT, lvl - 1, POWER_BASE))
}

/**
 * @param adventurer
 * @param state
 * @returns {Stats}
 */
export function getAdventurerStats(adventurer, state = null){

  const bonusStatAffectors = adventurer.bonuses
    .map(bonusDef => new Bonus(bonusDef).stats)

  const loadoutStatAffectors = adventurer.items.filter(itemDef => itemDef)
    .map(itemDef => new ItemInstance(itemDef).stats)

  // TODO: extraz
  const stateAffectors = null
  return new Stats([
    ...bonusStatAffectors,
    ...loadoutStatAffectors
  ], stateAffectors)
}

/**
 * @param adventurer
 * @param state
 */
export function getAdventurerMods(adventurer, state = null){

  const bonusMods = adventurer.bonuses.map(bonus => new Bonus(bonus).mods)
  const loadoutMods = adventurer.items.filter(itemDef => itemDef)
    .map(itemDef => new ItemInstance(itemDef).mods)
  const stateMods = []
  return new ModsCollection(bonusMods, loadoutMods, stateMods)
}

export function getAdventurerOrbsData(adventurer, items = adventurer.items){
  const used = adventurer.bonuses.map(bonusDef => {
    return new Bonus(bonusDef).orbsData.maxOrbs
  })
  const max = items.filter(i => i).map(itemDef => new ItemInstance(itemDef).orbs)
  return new OrbsData(used, max)
}