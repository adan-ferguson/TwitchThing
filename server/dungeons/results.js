import Adventurers from '../collections/adventurers.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import Users from '../collections/users.js'
import { getIdleAdventurerStats, xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import { xpToLevel as userXpToLevel } from '../../game/user.js'
import Stats from '../../game/stats/stats.js'
import { calculateBonusOptions } from './bonuses.js'
import { randomRound } from '../../game/rando.js'
import { generateItemDef } from '../items/generator.js'
import { toArray } from '../../game/utilFunctions.js'
import { generateChest, generateRandomChest } from './chests.js'

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

export async function finalizeResults(user, adventurer, selectedBonuses){

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

  await saveAdventurer()
  await saveUser()

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
      xp: xpAfter,
      'accomplishments.highestFloor': Math.max(dungeonRun.floor, adventurer.accomplishments.highestFloor)
    }

    if(bonuses.length){
      updates.baseStats = new Stats([adventurer.baseStats, ...bonuses]).serialize()
      updates.level = advXpToLevel(xpAfter)
    }

    await Adventurers.update(adventurer._id, updates)
  }

  async function saveUser(){
    const userDoc = await Users.findOne(adventurer.userID)
    const xpAfter = userDoc.xp + dungeonRun.results.rewards.xp
    userDoc.xp = xpAfter
    userDoc.level = userXpToLevel(xpAfter)

    dungeonRun.results.rewards.chests?.forEach(chest => {
      chest.contents.items?.forEach(item => {
        userDoc.inventory.items[item.id] = item
      })
    })

    dungeonRun.results.userLevelups?.forEach(ulvl => {
      if(ulvl.features){
        ulvl.features.forEach(featureName => userDoc.features[featureName] = 1)
      }
      if(ulvl.chest){
        if(ulvl.chest.contents.items){
          ulvl.chest.contents.items.forEach(item => {
            userDoc.inventory.items[item.id] = item
          })
        }
      }
    })

    await Users.save(userDoc)
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

function previewUserLevelUp(dungeonRun, level){
  const obj = { level, features: [] }
  if(level === 1){
    obj.features = ['chests', 'items', 'relics']
    obj.chest = generateChest({
      items: [generateItemDef('SWORD')]
    }, {
      name: 'Level-Up Chest',
      level: level,
      tier: 2
    })
  }else{
    obj.chest = generateRandomChest(dungeonRun, {
      name: 'Level-Up Chest',
      level: level,
      tier: 2
    })
  }
  return obj
}

function generateLevelups(dungeonRun){
  const adventurer = dungeonRun.adventurer
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
    levelups.push(previewUserLevelUp(dungeonRun, levelBefore + 1))
  }
  return levelups
}