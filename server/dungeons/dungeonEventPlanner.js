import { foundMonster, generateMonster } from '../monsters/generator.js'
import { generateCombat } from '../combat/combat.js'
import { foundRelic, generateRelicEvent } from './relics.js'
import { foundStairs } from './stairs.js'

/**
 * @param dungeonRun {DungeonRunInstance}
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(dungeonRun){

  const floor = dungeonRun.floor
  const room = dungeonRun.room
  const adventurerInstance = dungeonRun.adventurerInstance

  if(foundStairs(floor, room, adventurerInstance.stats.get('stairFind').value)){
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
      message: `${dungeonRun.adventurer.name} is fighting a ${monster.name}.`,
      combatID: combat._id,
      monster
    }
  }

  if(foundRelic(dungeonRun)){
    return generateRelicEvent(dungeonRun)
  }

  return {
    message: `${adventurerInstance.name} is wandering around.`
  }
}