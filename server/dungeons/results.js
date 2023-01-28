import Adventurers from '../collections/adventurers.js'
import Users from '../collections/users.js'
import { toArray } from '../../game/utilFunctions.js'
import { emit } from '../socketServer.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import { advXpToLevel } from '../../game/adventurerInstance.js'
import { applyChestToUser } from './chests.js'
import Combats from '../collections/combats.js'

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

export async function finalize(dungeonRunDoc){

  if(dungeonRunDoc.finalized){
    throw { error: 'Dungeon run has already been finalized' }
  }

  if(!dungeonRunDoc.finished){
    throw { error: 'Dungeon run is not finished yet.' }
  }

  await saveAdventurer()
  await saveUser()
  await saveDungeonRun()
  await purgeOldRuns(dungeonRunDoc.adventurer._id)

  async function saveAdventurer(){
    const adventurerDoc = await Adventurers.findByID(dungeonRunDoc.adventurer._id)
    const xpAfter = adventurerDoc.xp + (dungeonRunDoc.rewards.xp || 0)
    adventurerDoc.dungeonRunID = null
    adventurerDoc.xp = xpAfter
    adventurerDoc.level = advXpToLevel(xpAfter)
    adventurerDoc.accomplishments.deepestFloor =
      Math.max(dungeonRunDoc.floor, adventurerDoc.accomplishments.deepestFloor)
    await Adventurers.save(adventurerDoc)
  }

  async function saveUser(){

    const userDoc = await Users.findByID(dungeonRunDoc.adventurer.userID)
    dungeonRunDoc.rewards.chests?.forEach(chest => {
      applyChestToUser(userDoc, chest)
    })

    if(!userDoc.features.dungeonPicker && dungeonRunDoc.floor > 1){
      userDoc.features.dungeonPicker = 1
    }

    if(!userDoc.accomplishments.firstRunFinished){
      userDoc.inventory.items.basic = { fighter : { slash : 1 } }
      userDoc.accomplishments.firstRunFinished = 1
      userDoc.features.editLoadout = 1
      emit(userDoc._id, 'show popup', {
        message: `You got crushed! What were you thinking? You didn't even have a weapon!
        
        I just hooked you up with an item. Go to your adventurer's inventory to equip it.`
      })
    }

    const cfBefore = userDoc.accomplishments.chestsFound ?? 0
    userDoc.accomplishments.chestsFound = cfBefore + (dungeonRunDoc.rewards.chests?.length ?? 0)
    if(cfBefore < 10 && userDoc.accomplishments.chestsFound >= 10){
      emit(userDoc._id, 'show popup', {
        message: `Monsters have been complaining that SOMEONE has been stealing their treasure chests!
        
        They're going to start hiding them a bit better.`
      })
    }

    if(!userDoc.features.shop && dungeonRunDoc.floor >= 11){
      userDoc.features.shop = 1
      emit(userDoc._id, 'show popup', {
        message: `You've unlocked the shop, where you can buy various things.
        
        Visit it from the main page, or via the gold counter in the header.`
      })
    }

    if(!userDoc.features.workshop && dungeonRunDoc.floor >= 21){
      userDoc.features.workshop = 1
      emit(userDoc._id, 'show popup', {
        message: `You've unlocked the forge, where you can craft and upgrade items.
        
        Visit it from the main page, or via the scrap counter in the header.`
      })
    }

    userDoc.accomplishments.deepestFloor = Math.max(userDoc.accomplishments.deepestFloor, dungeonRunDoc.floor)

    await Users.save(userDoc)
  }

  async function saveDungeonRun(){
    dungeonRunDoc.finalized = true
    await DungeonRuns.save(dungeonRunDoc)
  }
}

export async function cancelRun(dungeonRunDoc){
  const adventurerDoc = await Adventurers.findByID(dungeonRunDoc.adventurer._id)
  adventurerDoc.dungeonRunID = null
  await Adventurers.save(adventurerDoc)
}

export async function purgeAllOldRuns(){

  console.log('purging...')
  const runs = await DungeonRuns.find({
    query: {
      finalized: { $eq: true }
    }
  })

  console.log(`found ${runs.length} old runs`)

  let count = 0
  for(let i = 0; i < Math.min(100, runs.length); i++){
    count += await purgeReplay(runs[i])
  }
  return count
}

export async function purgeOldRuns(adventurerID){
  const runs = await DungeonRuns.find({
    query: {
      finalized: true,
      'adventurer._id': adventurerID,
      purged: { $ne: true }
    },
    sort: {
      startTime: 1
    }
  })
  runs.slice(5).forEach(dungeonRunDoc => purgeReplay(dungeonRunDoc))
}

async function purgeReplay(dungeonRunDoc){
  const combatIDs = []
  dungeonRunDoc.events.forEach(ev => {
    if(ev.combatID && ev.roomType === 'combat'){
      combatIDs.push(ev.combatID)
    }
  })
  const result = await Combats.collection.deleteMany({
    _id: { $in: combatIDs }
  })
  dungeonRunDoc.events = []
  dungeonRunDoc.purged = true
  await DungeonRuns.save(dungeonRunDoc)
  return result.deletedCount
}