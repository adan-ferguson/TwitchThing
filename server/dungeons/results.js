import * as Adventurers from '../collections/adventurers.js'
import { getStats, xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import * as Users from '../collections/users.js'
import { xpToLevel as userXpToLevel } from '../../game/user.js'
import * as DungeonRuns from 'mongodb'
import { mergeStats } from '../../game/stats.js'

export async function calculateResults(dungeonRunDoc){
  const adventurer = await Adventurers.findOne(dungeonRunDoc.adventurerID)
  const levelAfter = advXpToLevel(adventurer.xp + dungeonRunDoc.rewards.xp)
  const levelups = []
  for(let levelBefore = adventurer.level; levelBefore < levelAfter; levelBefore++){
    levelups.push(previewLevelup(adventurer, levelBefore + 1))
  }
  return {
    rewards: dungeonRunDoc.rewards,
    levelups
  }
}

export async function finalizeResults(adventurerID, selectedBonuses){

  const adventurer = await Adventurers.findOne(adventurerID, {
    dungeonRunID: 1,
    name: 1,
    xp: 1,
    level: 1
  })

  if(!adventurer.dungeonRunID){
    throw { code: 401, error: 'Adventurer is not currently in a dungeon.', targetPage: 'Adventurer' }
  }

  const dungeonRun = await DungeonRuns.findOne(adventurerID.dungeonRunID)

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
      bonuses.push({
        [selectedOption.type]: selectedOption.value
      })
      bonuses.push(levelup.stats)
    })

    const newStats = mergeStats(adventurer.baseStats, ...bonuses)

    await Adventurers.update(adventurerID, {
      dungeonRun: null,
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

  const bonusOptions = []
  const stats = getStats(adventurer)

  bonusOptions.push({
    type: 'hp',
    value: Math.ceil(stats.getCompositeStat('hp') * 0.1)
  })
  bonusOptions.push({
    type: 'attack',
    value: Math.ceil(stats.getCompositeStat('hp') * 0.1)
  })

  // TODO: add options provided by items

  return {
    stats: {
      hp: Math.ceil(stats.getCompositeStat('hp') * 0.1),
      attack: Math.ceil(stats.getCompositeStat('attack') * 0.1)
    },
    options: bonusOptions,
    level
  }
}