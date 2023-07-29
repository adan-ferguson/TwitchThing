import Adventurers from '../collections/adventurers.js'
import Users from '../collections/users.js'
import { arrayize } from '../../game/utilFunctions.js'
import { emit } from '../socketServer.js'
import DungeonRuns from '../collections/dungeonRuns.js'
import { advXpToLevel } from '../../game/adventurer.js'
import { applyChestToUser } from './chests.js'
import Combats from '../collections/combats.js'
import { adjustInventoryBasics } from '../user/inventory.js'

const REWARDS_TYPES = {
  xp: 'num',
  chests: 'array',
  food: 'num',
  pityPoints: 'num'
}

export function addRewards(rewards, toAdd){
  if(Array.isArray(toAdd)){
    toAdd.forEach(r => rewards = addRewards(rewards, r))
    return rewards
  }
  const r = { ...rewards }
  for(let key in toAdd){

    if(!(key in REWARDS_TYPES)){
      continue
    }

    if(REWARDS_TYPES[key] === 'num'){
      if(!r[key]){
        r[key] = 0
      }
      r[key] += toAdd[key]
    }else if(REWARDS_TYPES[key] === 'array'){
      if(!r[key]){
        r[key] = []
      }
      r[key].push(...arrayize(toAdd[key]))
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
  let deepestFloor = dungeonRunDoc.floor
  if(['cleared','outOfOrder'].includes(lastEvent.roomType)){
    deepestFloor += 1
  }

  const adventurerDoc = await saveAdventurer()
  const userDoc = await Users.findByID(dungeonRunDoc.adventurer.userID)
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
    // if(deepestFloor === 60 && lastEvent.roomType === 'cleared' && !adventurerDoc.accomplishments.deepestSuperFloor){
    //   adventurerDoc.accomplishments.deepestSuperFloor = 1
    //   emit(userDoc._id, 'show popup', {
    //     title: 'Wow!',
    //     message: `${adventurerDoc.name} cleared the whole dungeon, now try the unfair and gigantic waste of time SUPER dungeon!`
    //   })
    // }
    await Adventurers.save(adventurerDoc)
    return adventurerDoc
  }

  async function saveUser(){

    dungeonRunDoc.rewards.chests?.forEach(chest => {
      applyChestToUser(userDoc, chest)
    })

    if(!userDoc.features.dungeonPicker && deepestFloor > 1){
      userDoc.features.dungeonPicker = 1
    }

    if(!userDoc.accomplishments.firstRunFinished){
      adjustInventoryBasics(userDoc, { shortSword: 1 })
      userDoc.accomplishments.firstRunFinished = 1
      userDoc.features.editLoadout = 1
      emit(userDoc._id, 'show popup', {
        title: 'Augh!',
        message: `You got crushed! What were you thinking? You didn't even have a weapon!
        
        I just hooked you up with an item. Go to your adventurer's inventory to equip it.`
      })
    }

    if(adventurerDoc.level > 1 && !userDoc.features.spendPoints){
      adjustInventoryBasics(userDoc, { shortSword: 1 })
      userDoc.features.spendPoints = 1
      emit(userDoc._id, 'show popup', {
        title: 'That Went Better',
        message: `Your adventurer leveled up! Go to the Edit Adventurer page to assign orbs (or not, whatever).
        
        Orbs let you equip more items and unlock skills.`
      })
    }

    if(adventurerDoc.level >= 5 && !userDoc.features.skills){
      userDoc.features.skills = 1
      emit(userDoc._id, 'show popup', {
        title: 'Skill Point!',
        message: 'You got your first skill point, go spend it now! Now now now!'
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
      startTime: -1
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
  const result = await Combats.collection.updateMany({
    _id: { $in: combatIDs }
  }, [{
    $unset: 'timeline'
  }])
  return result.modifiedCount
}