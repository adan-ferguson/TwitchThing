import Adventurers from '../collections/adventurers.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import Users from '../collections/users.js'
import { getIdleAdventurerStats, xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import { xpToLevel as userXpToLevel } from '../../game/user.js'
import Stats, { mergeStats } from '../../game/stats/stats.js'
import { calculateBonusOptions } from './bonuses.js'
import { randomRound } from '../../game/rando.js'
import { generateItemDef } from '../items/generator.js'
import { toArray } from '../../game/utilFunctions.js'
import { generateChest } from './chests.js'

const GROWTH_SCALE = 0.10

const REWARDS_TYPES = {
  xp: 'int',
  chests: 'array'
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
      r[key].push(...toArray(toAdd[key]))
    }
  }
  return r
}

export function calculateResults(dungeonRun){
  return {
    rewards: dungeonRun.rewards,
    levelups: generateLevelups(dungeonRun),
    userLevelups: generateUserLevelups(dungeonRun)
  }
}

export async function finalizeResults(adventurerID, selectedBonuses){

  const adventurer = await Adventurers.findOne(adventurerID)

  if(!adventurer.dungeonRunID){
    throw { code: 401, error: 'Adventurer is not currently in a dungeons.', targetPage: 'Adventurer' }
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

    const updates = {
      dungeonRunID: null,
      xp: xpAfter
    }

    if(bonuses.length){
      updates.baseStats = new Stats([adventurer.baseStats, ...bonuses]).serialize()
      updates.level = advXpToLevel(xpAfter)
    }

    await Adventurers.update(adventurerID, updates)
  }

  async function saveUser(){
    const user = await Users.findOne(adventurer.userID)
    const xpAfter = user.xp + dungeonRun.results.rewards.xp
    await Users.update(adventurer.userID, {
      xp: xpAfter,
      level: userXpToLevel(xpAfter)
    })
  }
}

function previewLevelup(adventurer, level){

  const stats = getIdleAdventurerStats({  adventurer })
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

function previewUserLevelUp(user, level){
  const obj = {}
  if(level === 1){
    obj.features = ['chests', 'items']
    obj.chest = generateChest({
      name: 'Level-Up Chest',
      level: level,
      contents: {
        items: [generateItemDef('SWORD')]
      },
      tier: 2
    })
  }else{
    obj.chest = generateChest({
      name: 'Level-Up Chest',
      level: level,
      tier: 2
    })
  }
  return obj
}

function generateLevelups(dungeonRun){
  const adventurer = dungeonRun.adventurer
  const xp = dungeonRun.rewards.xp
  const levelAfter = advXpToLevel(adventurer.xp + dungeonRun.rewards.xp)
  const levelups = []
  for(let levelBefore = adventurer.level; levelBefore < levelAfter; levelBefore++){
    levelups.push(previewLevelup(adventurer, levelBefore + 1))
  }
  return levelups
}

function generateUserLevelups(dungeonRun){
  const user = dungeonRun.user
  const levelAfter = userXpToLevel(user.xp + dungeonRun.rewards.xp)
  const levelups = []
  for(let levelBefore = user.level; levelBefore < levelAfter; levelBefore++){
    levelups.push(previewUserLevelUp(user, levelBefore + 1))
  }
  return levelups
}