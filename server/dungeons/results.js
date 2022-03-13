import Adventurers from '../collections/adventurers.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import Users from '../collections/users.js'
import { getStats, xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import { xpToLevel as userXpToLevel } from '../../game/user.js'
import { mergeStats } from '../../game/stats/stats.js'
import { calculateBonusOptions } from './bonuses.js'
import { randomRound } from '../../game/rando.js'

const GROWTH_SCALE = 0.10

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
    const xpAfter = adventurer.xp + Math.floor(dungeonRun.results.rewards.xp)

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
  const growths = {
    hpMax: Math.max(1, randomRound(stats.get('hpMax').value * GROWTH_SCALE)),
    attack: Math.max(1, randomRound(stats.get('attack').value * GROWTH_SCALE))
  }

  return {
    stats: growths,
    options: calculateBonusOptions(stats, level),
    level
  }
}