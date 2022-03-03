import { foundMonster, generateMonster } from '../monster/generator.js'
import { generateCombat } from '../combat/combat.js'

/**
 * @param adventurerInstance
 * @param dungeonRun
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(adventurerInstance, dungeonRun){

  const floor = dungeonRun.floor
  const room = dungeonRun.room

  if(foundStairs(floor, room)){
    return {
      nextRoom: 1,
      nextFloor: floor + 1,
      message: `${adventurerInstance.name} found the stairs and goes deeper.`
    }
  }

  if(foundMonster(dungeonRun)){
    const monster = await generateMonster(dungeonRun)
    const combat = await generateCombat(adventurerInstance.adventurer, monster, adventurerInstance.adventurerState)
    return {
      duration: combat.duration,
      pending: true,
      combatID: combat._id,
      monster: true
    }
  }

  if(foundRelic(adventurerInstance, dungeonRun)){
    return generateRelicEvent(adventurerInstance, dungeonRun)
  }

  return {
    message: `${adventurerInstance.name} is wandering around.`
  }
}

function foundStairs(floor, room){
  const stairsChance = (-5 + room) / (5 + floor)
  return Math.random() < stairsChance
}