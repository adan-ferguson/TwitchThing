import { foundMonster } from './monsters.js'
import { foundStairs } from './stairs.js'
import { generateCombatEvent } from '../combat.js'
import { shouldRest, rest } from './resting.js'

/**
 * @param dungeonRun {DungeonRunInstance}
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(dungeonRun){

  const floor = dungeonRun.floor
  const room = dungeonRun.room
  const adventurerInstance = dungeonRun.adventurerInstance
  const bossFloor = floor % 10 === 0
  const previousEvent = dungeonRun.events.at(-1)

  if(previousEvent.boss){
    if(floor === 50){
      return {
        runFinished: true,
        roomType: 'outoforder',
        message: `${adventurerInstance.display} finds that the stairs to the next zone are out of order, what a rip off!`
      }
    }
    return {
      nextRoom: 1,
      nextFloor: floor + 1,
      roomType: 'nextzone',
      message : `${adventurerInstance.displayName} advances to the next zone.`
    }
  }

  if(dungeonRun.user.accomplishments.firstRunFinished && foundStairs(dungeonRun)){
    if(bossFloor){
      return await generateCombatEvent(dungeonRun, true)
    }
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

  if(shouldRest(dungeonRun)){
    return rest(dungeonRun)
  }

  const encounterPossible = (previousEvent?.combatID || room <= 1) ? false : true

  if(encounterPossible && foundMonster(dungeonRun)){
    return await generateCombatEvent(dungeonRun)
  }

  const message = `${adventurerInstance.displayName} is wandering around.`

  return {
    message,
    nextRoom: room + 1
  }
}