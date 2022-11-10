import { foundMonster } from './monsters.js'
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

  // TODO: message after clearing floor 50 boss?
  // if(floor === 30 && room >= 200){
  //   return {
  //     message: `${adventurerInstance.displayName} gets bored and leaves.`,
  //     runFinished: true
  //   }
  // }

  if(dungeonRun.user.accomplishments.firstRunFinished && foundStairs(dungeonRun)){
    const message = dungeonRun.pace === 'Brisk' ?
      `${adventurerInstance.displayName} found the stairs and goes deeper.` :
      `${adventurerInstance.displayName} feels like they've finished exploring this floor.`
    return {
      nextRoom: 1,
      nextFloor: floor + 1,
      roomType: 'stairs',
      message: message
    }
  }

  const previousEvent = dungeonRun.events.at(-1)
  const encounterPossible = previousEvent?.monster ? false : true

  if(encounterPossible && foundMonster(dungeonRun)){
    return await generateCombatEvent(dungeonRun)
  }

  return {
    message: `${adventurerInstance.displayName} is wandering around.`
  }
}