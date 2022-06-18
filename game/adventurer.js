import Stats from './stats/stats.js'
import LevelCalculator from './levelCalculator.js'
import scaledValue from './scaledValue.js'
import OrbsData from './orbsData.js'
import { getItemOrbs, getItemStats } from './item.js'
import { getBonusStats } from './bonus.js'

const LEVEL_2_XP = 100
const XP_MULTIPLIER = 0.4

const HP_BASE = 100
const HP_GROWTH_PCT = 0.1
const POWER_BASE = 9
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
    .map(bonus => getBonusStats(bonus))

  const loadoutStatAffectors = adventurer.items.filter(itemDef => itemDef)
    .map(itemDef => getItemStats(itemDef))

  // TODO: extraz
  const stateAffectors = null
  return new Stats([
    ...bonusStatAffectors,
    ...loadoutStatAffectors
  ], stateAffectors)
}

export function getAdventurerOrbsData(adventurer){
  return new OrbsData(
    adventurer.bonuses.map(bonus => {
      return { [bonus.group]: 1 }
    }),
    adventurer.items.filter(i => i).map(getItemOrbs)
  )

  // TODO: items -> usedOrbs
  // TODO: items might affect maxOrbs as well
  // TODO: adventurer slots might affect usedOrbs
}