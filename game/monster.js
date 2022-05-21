import scaledValue from './scaledValue.js'
import Stats from './stats/stats.js'
import OrbsData from './orbsData.js'

const POWER_MULTIPLIER = 0.25

const HP_BASE = 40
const XP_BASE = 50
const POWER_BASE = 10

export function getScalingValue(lvl){
  const zones = Math.floor((lvl - 1) / 10)
  const iterations = lvl + zones
  return scaledValue(POWER_MULTIPLIER, iterations)
}

export function levelToXpReward(lvl){
  return Math.ceil(getScalingValue(lvl - 1) * XP_BASE)
}

export function levelToHp(lvl){
  return Math.ceil(getScalingValue(lvl - 1) * HP_BASE)
}

export function levelToPower(lvl){
  return Math.ceil(getScalingValue(lvl - 1) * POWER_BASE)
}

/**
 * @param monster
 * @param state
 * @returns {Stats}
 */
export function getMonsterStats(monster, state = null){
  const loadoutStatAffectors = (monster.mods || [])
    .map(modDef => modDef?.stats)
    .filter(s => s)
  // TODO: extraz
  const stateAffectors = null
  return new Stats(loadoutStatAffectors, stateAffectors)
}

export function getMonsterOrbsData(monster){
  // TODO: all this
  return new OrbsData()
  // const maxOrbs = {}
  // monster.mods.forEach(bonus => {
  //   maxOrbs[bonus.className]++
  //   if(!bonus.orbs){
  //     return
  //   }
  //   for(let className in bonus.orbs){
  //     if(!maxOrbs[className]){
  //       maxOrbs[className] = 0
  //     }
  //     maxOrbs[className] += bonus.orbs[className]
  //   }
  // })
  // return new OrbsData(maxOrbs)
}