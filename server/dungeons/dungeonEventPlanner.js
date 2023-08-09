import { foundMonster, generateMonster } from './monsters.js'
import { foundStairs } from './stairs.js'
import { generateCombatEvent } from '../combat/fns.js'
import { shouldRest, rest } from './resting.js'
import { runEnd } from './runEnd.js'
import { generateSneakEvent, trySneak } from './sneak.js'

/**
 * @param dungeonRun {DungeonRunInstance}
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(dungeonRun){

  const floor = dungeonRun.floor
  const room = dungeonRun.room
  const adventurerInstance = dungeonRun.adventurerInstance
  const bossFloor = floor % 10 === 0
  const previousEvent = dungeonRun.newestEvent

  if(previousEvent.data.monster?.boss){
    const runEndEvent = runEnd(dungeonRun)
    if(runEndEvent){
      return runEndEvent
    }
    return {
      nextRoom: 1,
      nextFloor: floor + 1,
      roomType: 'nextZone',
      message : `${adventurerInstance.displayName} advances to the next zone.`
    }
  }

  if(dungeonRun.user.accomplishments.firstRunFinished && foundStairs(dungeonRun)){
    if(bossFloor){
      const monsterDef = await generateMonster(dungeonRun, true)
      return await generateCombatEvent(dungeonRun, monsterDef)
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

  const encounterPossible = previousEvent.data.wandering ? true : false //(previousEvent?.combatID || room <= 1) ? false : true

  if(encounterPossible && foundMonster(dungeonRun)){
    const monsterDef = await generateMonster(dungeonRun)
    if(trySneak(adventurerInstance)){
      return generateSneakEvent(dungeonRun, monsterDef)
    }
    return await generateCombatEvent(dungeonRun, monsterDef)
  }

  if(dungeonRun.instructions.leave){
    return {
      runFinished: true,
      roomType: 'leave',
      message: `${dungeonRun.adventurerInstance.displayName} leaves the dungeon as per your instructions. (Boring)`
    }
  }

  const message = `${adventurerInstance.displayName} is wandering around.`

  return {
    message,
    wandering: true,
    nextRoom: room + 1
  }
}