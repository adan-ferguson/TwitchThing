import Adventurers from '../collections/adventurers.js'
import Users from '../collections/users.js'
import { xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import { toArray } from '../../game/utilFunctions.js'
import { generateLevelup } from '../adventurer/bonuses.js'

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

  async function saveAdventurer(){
    const adventurerDoc = await Adventurers.findOne(dungeonRunDoc.adventurer._id)
    const xpAfter = adventurerDoc.xp + dungeonRunDoc.rewards.xp
    adventurerDoc.dungeonRunID = null
    adventurerDoc.xp = xpAfter
    adventurerDoc.level = advXpToLevel(xpAfter)
    adventurerDoc.accomplishments.highestFloor =
      Math.max(dungeonRunDoc.floor, adventurerDoc.accomplishments.highestFloor)

    if(adventurerDoc.level > adventurerDoc.bonuses.length){
      adventurerDoc.nextLevelUp = await generateLevelup(adventurerDoc)
    }

    await Adventurers.save(adventurerDoc)
  }

  async function saveUser(){
    const userDoc = await Users.findOne(dungeonRunDoc.userID)
    dungeonRunDoc.rewards.chests?.forEach(chest => {
      chest.contents.items?.forEach(item => {
        userDoc.inventory.items[item.id] = item
      })
    })

    // TODO: Emit when new things get unlocked
    userDoc.accomplishments.highestFloor =
      Math.max(dungeonRunDoc.floor, userDoc.accomplishments.highestFloor)

    if(!userDoc.features.items){
      // TODO: emit notification + give the user an item
      userDoc.features.items = 1
    }

    await Users.save(userDoc)
  }
}