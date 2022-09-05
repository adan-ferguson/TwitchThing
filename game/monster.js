import scaledValue from './scaledValue.js'
import Stats from './stats/stats.js'
import OrbsData from './orbsData.js'
import ModsCollection from './modsCollection.js'

const REWARD_MULTIPLIER = 0.17
const POWER_MULTIPLIER = 0.19
const HP_MULTIPLIER = 0.21

const HP_BASE = 40
const XP_BASE = 50
const POWER_BASE = 10

export function getScalingValue(lvl, multiplier){
  lvl = lvl - 1
  const zones = Math.floor(lvl / 10)
  const iterations = lvl + zones
  return scaledValue(multiplier, iterations)
}

export function levelToXpReward(lvl){
  return Math.ceil(getScalingValue(lvl, REWARD_MULTIPLIER) * XP_BASE)
}

export function monsterLevelToHp(lvl){
  return Math.ceil(getScalingValue(lvl, HP_MULTIPLIER) * HP_BASE)
}

export function monsterLevelToPower(lvl){
  return Math.ceil(getScalingValue(lvl, POWER_MULTIPLIER) * POWER_BASE)
}

/**
 * @param monsterInstance
 * @returns {Stats}
 */
export function getMonsterStats(monsterInstance){
  const loadoutStatAffectors = (monsterInstance.items || [])
    .map(modDef => modDef?.stats)
    .filter(s => s)
  loadoutStatAffectors.push(monsterInstance.baseStats ?? {})
  // TODO: extraz
  const stateAffectors = null
  return new Stats(loadoutStatAffectors, stateAffectors)
}

/**
 * @param monsterInstance
 */
export function getMonsterMods(monsterInstance){
  const loadoutMods = (monsterInstance.items || [])
    .map(modDef => modDef?.mods)
    .filter(m => m)
  const stateMods = []
  return new ModsCollection(...loadoutMods, ...stateMods)
}

export function getMonsterOrbsData(monsterInstance){
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