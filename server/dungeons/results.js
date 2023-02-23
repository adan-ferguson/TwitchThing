import Adventurers from '../collections/adventurers.js'
import Users from '../collections/users.js'
import { toArray } from '../../game/utilFunctions.js'
import { emit } from '../socketServer.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import { advXpToLevel } from '../../game/adventurerInstance.js'
import { applyChestToUser } from './chests.js'
import Combats from '../collections/combats.js'
import { adjustInventoryBasics } from '../loadouts/inventory.js'
import { checkForRewards } from '../user/rewards.js'

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

  const lastEvent = dungeonRunDoc.events.at(-1)
  const deepestFloor = dungeonRunDoc.floor + (lastEvent.roomType === 'cleared' ? 1 : 0)

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
    adventurerDoc.accomplishments.deepestFloor = Math.max(deepestFloor, adventurerDoc.accomplishments.deepestFloor)
    if(dungeonRunDoc.floor === 51){
      adventurerDoc.accomplishments.superMonster = Math.max(dungeonRunDoc.room - 1, adventurerDoc.accomplishments.superMonster)
    }
    await Adventurers.save(adventurerDoc)
  }

  async function saveUser(){

    const userDoc = await Users.findByID(dungeonRunDoc.adventurer.userID)
    dungeonRunDoc.rewards.chests?.forEach(chest => {
      applyChestToUser(userDoc, chest)
    })

    if(!userDoc.features.dungeonPicker && deepestFloor > 1){
      userDoc.features.dungeonPicker = 1
    }

    if(!userDoc.accomplishments.firstRunFinished){
      adjustInventoryBasics(userDoc, { fighter : { slash : 1 } })
      userDoc.accomplishments.firstRunFinished = 1
      userDoc.features.editLoadout = 1
      emit(userDoc._id, 'show popup', {
        title: 'You fool!',
        message: `You got crushed! What were you thinking? You didn't even have a weapon!
        
        I just hooked you up with an item. Go to your adventurer's inventory to equip it.`
      })
    }

    const cfBefore = userDoc.accomplishments.chestsFound ?? 0
    userDoc.accomplishments.chestsFound = cfBefore + (dungeonRunDoc.rewards.chests?.length ?? 0)
    if(cfBefore < 10 && userDoc.accomplishments.chestsFound >= 10){
      emit(userDoc._id, 'show popup', {
        title: 'Hey!',
        message: `Monsters have been complaining that SOMEONE has been stealing their treasure chests!
        
        They're going to start hiding them a bit better.`
      })
    }

    userDoc.accomplishments.deepestFloor = Math.max(userDoc.accomplishments.deepestFloor, deepestFloor)
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
  await DungeonRuns.delete(dungeonRunDoc)
}

export async function purgeAllOldRuns(){

  console.log('purging...')
  const runs = await DungeonRuns.find({
    query: {
      finalized: { $eq: true },
      purged: { $ne: true }
    },
    projection: {
      finalized: 1,
      _id: 1
    }
  })
  const ids = runs.map(run => run._id)

  console.log(`found ${ids.length} old runs`)

  const INTERVAL = 100
  let count = 0
  for(let i = 0; i < runs.length; i += INTERVAL){
    console.log(`${i} to ${i + INTERVAL - 1}`)
    const runs = await DungeonRuns.findByIDs(ids.slice(i, i + INTERVAL))
    console.log('purging runs...')
    count += await purgeReplays(runs)
    console.log(`${count} combats deleted.`)
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
  purgeReplays(runs.slice(5))
}

async function purgeReplays(drDocs){
  const combatIDs = []
  for(let doc of drDocs){
    doc.events.forEach(ev => {
      if (ev.combatID && ev.roomType === 'combat'){
        combatIDs.push(ev.combatID)
      }
    })
    doc.events = []
    doc.purged = true
    await DungeonRuns.save(doc)
  }
  console.log('Deleting combats')
  const result = await Combats.collection.deleteMany({
    _id: { $in: combatIDs }
  })
  return result.deletedCount
}