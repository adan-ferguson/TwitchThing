import { foundMonster } from './monsters.js'
import { foundRelic, generateRelicEvent } from './relics.js'
import { foundStairs } from './stairs.js'
import { generateCombatEvent } from '../combat.js'

/**
 * @param dungeonRun {DungeonRunInstance}
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(dungeonRun){

  const floor = dungeonRun.floor
  const room = dungeonRun.room
  const adventurerInstance = dungeonRun.adventurerInstance

  if(floor === 30 && room >= 200){
    return {
      message: `${adventurerInstance.name} gets bored and leaves.`,
      runFinished: true
    }
  }

  if(dungeonRun.user.accomplishments.firstRunFinished && foundStairs(floor, room, dungeonRun.pace)){
    const message = dungeonRun.pace === 'Brisk' ?
      `${adventurerInstance.name} found the stairs and goes deeper.` :
      `${adventurerInstance.name} feels like they've finished exploring this floor.`
    return {
      nextRoom: 1,
      nextFloor: floor + 1,
      roomType: 'stairs',
      message: message
    }
  }

  const previousEvent = dungeonRun.events.at(-1)
  const encounterPossible = previousEvent?.monster || previousEvent?.relic ? false : true

  if(encounterPossible && foundMonster(dungeonRun)){
    return await generateCombatEvent(dungeonRun)
  }

  if(encounterPossible && foundRelic(dungeonRun)){
    return generateRelicEvent(dungeonRun)
  }

  return {
    message: `${adventurerInstance.displayName} is wandering around.`
  }
}