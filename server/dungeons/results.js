import Adventurers from '../collections/adventurers.js'
import Users from '../collections/users.js'
import { xpToLevel as advXpToLevel } from '../../game/adventurer.js'
import { toArray } from '../../game/utilFunctions.js'
import { generateLevelup } from '../adventurer/bonuses.js'
import ZONES, { floorToZone } from '../../game/zones.js'
import { emit } from '../socketServer.js'
import { generateItemDef } from '../items/generator.js'

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
    const xpAfter = adventurerDoc.xp + (dungeonRunDoc.rewards.xp || 0)
    adventurerDoc.dungeonRunID = null
    adventurerDoc.xp = xpAfter
    adventurerDoc.level = advXpToLevel(xpAfter)
    adventurerDoc.accomplishments.deepestFloor =
      Math.max(dungeonRunDoc.floor, adventurerDoc.accomplishments.deepestFloor)
    adventurerDoc.nextLevelUp = await generateLevelup(adventurerDoc)
    await Adventurers.save(adventurerDoc)
  }

  async function saveUser(){
    const userDoc = await Users.findOne(dungeonRunDoc.adventurer.userID)
    dungeonRunDoc.rewards.chests?.forEach(chest => {
      chest.contents.items?.forEach(item => {
        userDoc.inventory.items[item.id] = item
      })
    })

    if(userDoc.accomplishments.deepestFloor === 1 && dungeonRunDoc.floor > 1){
      userDoc.features.dungeonPicker = 1
    }
    userDoc.accomplishments.deepestFloor = Math.max(userDoc.accomplishments.deepestFloor, dungeonRunDoc.floor)

    if(!userDoc.accomplishments.firstRunFinished){
      const sword = generateItemDef({ group: 'fighter', name: 'sword' })
      userDoc.inventory.items[sword.id] = sword
      userDoc.accomplishments.firstRunFinished = 1
      userDoc.features.editLoadout = 1
      emit(userDoc._id, 'show popup', {
        message: `You got crushed! What were you thinking? You didn't even have a weapon!
        
        I just hooked you up with a sword. Go to your adventurer's inventory to equip it.`
      })
    }

    await Users.save(userDoc)
  }
}

