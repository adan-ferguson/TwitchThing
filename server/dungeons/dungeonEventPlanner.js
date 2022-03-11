import { foundMonster, generateMonster } from '../monster/generator.js'
import { generateCombat } from '../combat/combat.js'
import { foundRelic, generateRelicEvent } from './relics.js'
import scaledValue from '../../game/scaledValue.js'

const FLOOR_SIZE_BASE = 10
const FLOOR_SIZE_SCALE = 0.05

/**
 * @param adventurerInstance
 * @param dungeonRun
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(adventurerInstance, dungeonRun){

  const floor = dungeonRun.floor
  const room = dungeonRun.room

  if(foundStairs(floor, room, adventurerInstance.stats.get('stairFind').convertedValue)){
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

function foundStairs(floor, room, stairFind){
  debugger
  const maxRooms = Math.floor(scaledValue(FLOOR_SIZE_SCALE, floor, FLOOR_SIZE_BASE))
  const stairsChance = 1 / Math.max(1, maxRooms - room + 1)
  return Math.random() < stairsChance * stairFind
}