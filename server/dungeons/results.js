import Adventurers from '../collections/adventurers.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import Users from '../collections/users.js'
import { getStats, xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import { xpToLevel as userXpToLevel } from '../../game/user.js'
import { mergeStats, StatDefinitions } from '../../game/stats.js'
import scaledValue from '../../game/scaledValue.js'

const GROWTH_SCALE = 0.10
const BONUS_BASE_WEIGHT = 20
const BONUS_WEIGHT_GROWTH = 0.12

const REWARDS_TYPES = {
  xp: 'int'
}

export function addRewards(rewards, toAdd){
  const r = { ...rewards }
  for(let key in toAdd){

    if(!(key in REWARDS_TYPES)){
      continue
    }

    if(REWARDS_TYPES[key] === 'int'){
      if(!r[key]){
        r[key] = 0
      }
      r[key] += toAdd[key]
    }else if(REWARDS_TYPES[key] === 'array'){
      if(!r[key]){
        r[key] = []
      }
      r[key].push(toAdd[key])
    }
  }
  return r
}

export function calculateResults(adventurer, rewards){
  const levelAfter = advXpToLevel(adventurer.xp + rewards.xp)
  const levelups = []
  for(let levelBefore = adventurer.level; levelBefore < levelAfter; levelBefore++){
    levelups.push(previewLevelup(adventurer, levelBefore + 1))
  }
  return {
    rewards,
    levelups
  }
}

export async function finalizeResults(adventurerID, selectedBonuses){

  const adventurer = await Adventurers.findOne(adventurerID)

  if(!adventurer.dungeonRunID){
    throw { code: 401, error: 'Adventurer is not currently in a dungeon.', targetPage: 'Adventurer' }
  }

  const dungeonRun = await DungeonRuns.findOne(adventurer.dungeonRunID)

  if(!dungeonRun){
    throw { code: 401, error: 'Dungeon run not found.', targetPage: 'Adventurer' }
  }

  if(!dungeonRun.finished){
    return { code: 401, error: 'Dungeon run is not finished yet.', targetPage: 'Dungeon' }
  }

  if(selectedBonuses.length !== dungeonRun.results.levelups.length){
    return { code: 401, error: 'Selected bonuses array length mismatched' }
  }

  await Promise.all([saveAdventurer(), saveUser()])

  async function saveAdventurer(){
    const xpAfter = adventurer.xp + dungeonRun.results.rewards.xp

    const bonuses = []
    dungeonRun.results.levelups.forEach((levelup, index) => {
      const selectedOption = levelup.options[selectedBonuses[index]]
      bonuses.push(selectedOption)
      bonuses.push(levelup.stats)
    })

    const newStats = mergeStats(adventurer.baseStats, ...bonuses)
    await Adventurers.update(adventurerID, {
      dungeonRunID: null,
      xp: xpAfter,
      baseStats: newStats,
      level: advXpToLevel(xpAfter)
    })
  }

  async function saveUser(){
    // TODO: add level rewards
    const user = await Users.findOne(adventurer.userID)
    const xpAfter = user.xp + dungeonRun.results.rewards.xp
    await Users.update(adventurer.userID, {
      xp: xpAfter,
      level: userXpToLevel(xpAfter)
    })
  }
}

function previewLevelup(adventurer, level){

  const stats = getStats(adventurer)
  const growths = {}
  stats.getGrowables().forEach(type => {
    growths[type] = Math.ceil(stats.getStat(type) * GROWTH_SCALE)
  })
  const bonusWeight = scaledValue(BONUS_BASE_WEIGHT, BONUS_WEIGHT_GROWTH, level)
  return {
    stats: growths,
    options: calculateBonusOptions(stats, bonusWeight),
    level
  }
}

function calculateBonusOptions(stats, bonusWeight){

  const bonusOptions = {
    offensive: {},
    defensive: {},
    adventuring: {}
  }
  //
  // for (let type in StatDefinitions){
  //   const def = StatDefinitions[type]
  //   if (!def.category){
  //     continue
  //   }
  //   const val = stats.getWeightedValue(type)
  // }
  //
  // bonusOptions.push({
  //   hpMax: Math.floor(stats.getCompositeStat('hpMax') * 0.1)
  // })
  //
  // bonusOptions.push({
  //   attack: Math.floor(stats.getCompositeStat('attack') * 0.1)
  // })

  return bonusOptions
}