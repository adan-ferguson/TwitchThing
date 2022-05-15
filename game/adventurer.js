import Stats from './stats/stats.js'
import LevelCalculator from './levelCalculator.js'
import Item from './item.js'
import scaledValue from './scaledValue.js'
import OrbsData from './orbsData.js'

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
  return Math.ceil(scaledValue(HP_GROWTH_PCT, lvl - 1, HP_BASE))
}

export function levelToPower(lvl){
  return Math.ceil(scaledValue(POWER_GROWTH_PCT, lvl - 1, POWER_BASE))
}

/**
 * @param adventurer
 * @param state
 * @returns {Stats}
 */
export function getAdventurerStats(adventurer, state = null){
  const loadoutStatAffectors = adventurer.items.filter(itemDef => itemDef).map(itemDef => {
    const item = new Item(itemDef)
    return item.stats
  })
  // TODO: extraz
  const stateAffectors = null
  return new Stats([
    ...adventurer.bonuses.map(bonus => bonus.stats).filter(s => s),
    ...loadoutStatAffectors
  ], stateAffectors)
}

export function getAdventurerOrbsData(adventurer){

  const maxOrbs = {}
  adventurer.bonuses.forEach(bonus => {
    if(!bonus.orbs){
      return
    }
    for(let className of bonus.orbs){
      if(!maxOrbs[className]){
        maxOrbs[className] = 0
      }
      maxOrbs[className] += bonus.orbs[className]
    }
  })

  // TODO: items -> usedOrbs
  // TODO: items might affect maxOrbs as well
  // TODO: adventurer slots might affect usedOrbs
  return new OrbsData(maxOrbs)
}