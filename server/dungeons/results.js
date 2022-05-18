import Adventurers from '../collections/adventurers.js'
import Users from '../collections/users.js'
import { xpToLevel, xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import { generateBonusOptions } from './bonuses.js'
import { toArray } from '../../game/utilFunctions.js'

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

export async function calculateResults(dungeonRunDoc){
  dungeonRunDoc.results = {
    rewards: dungeonRunDoc.rewards,
    nextLevelup: await generateLevelup(dungeonRunDoc),
    selectedBonuses: []
  }
}

export async function selectBonus(dungeonRunDoc, index){
  dungeonRunDoc.results.selectedBonuses.push(dungeonRunDoc.results.nextLevelup.options[index])
  const nextLevelup = await generateLevelup(dungeonRunDoc)
  if(nextLevelup){
    dungeonRunDoc.results.nextLevelup = nextLevelup
  }
  return nextLevelup
}

export async function finalizeResults(dungeonRunDoc){

  if(dungeonRunDoc.finalized){
    throw { error: 'Dungeon run has already been finalized' }
  }

  if(!dungeonRunDoc.results){
    throw { error: 'Dungeon run is not finished yet.' }
  }

  if(dungeonRunDoc.results.nextLevelup){
    throw { error: 'Levelup has not been resolved yet.' }
  }

  await saveAdventurer()
  await saveUser()

  async function saveAdventurer(){
    const adventurerDoc = Adventurers.findOne(dungeonRunDoc.adventurer._id)
    const xpAfter = adventurerDoc.xp + dungeonRunDoc.results.rewards.xp
    adventurerDoc.bonuses.push(...dungeonRunDoc.results.selectedBonuses)
    adventurerDoc.dungeonRunID = null
    adventurerDoc.xp = xpAfter
    adventurerDoc.level = advXpToLevel(xpAfter)
    adventurerDoc.accomplishments.highestFloor =
      Math.max(dungeonRunDoc.floor, adventurerDoc.accomplishments.highestFloor)
    await Adventurers.save(adventurerDoc)
  }

  async function saveUser(){
    const userDoc = await Users.findOne(dungeonRunDoc.userID)
    dungeonRunDoc.results.rewards.chests?.forEach(chest => {
      chest.contents.items?.forEach(item => {
        userDoc.inventory.items[item.id] = item
      })
    })
    // TODO: if new slot unlocked, emit an update
    userDoc.accomplishments.highestFloor =
      Math.max(dungeonRunDoc.floor, userDoc.accomplishments.highestFloor)
    await Users.save(userDoc)
  }
}

async function generateLevelup(dungeonRun){
  const levelAfter = xpToLevel(dungeonRun.adventurer.xp + dungeonRun.rewards.xp)
  const nextLevel = dungeonRun.adventurer.level + 1 + (dungeonRun.results?.selectedBonuses.length || 0)
  if(levelAfter < nextLevel){
    return null
  }
  return {
    options: await generateBonusOptions(dungeonRun, nextLevel),
    level: nextLevel
  }
}