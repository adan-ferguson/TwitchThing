import { foundMonster, generateMonster } from './monsters.js'
import { generateCombat } from '../combat/combat.js'
import { foundRelic, generateRelicEvent } from './relics.js'
import { foundStairs } from './stairs.js'
import FighterInstance from '../../game/combat/fighterInstance.js'

/**
 * @param dungeonRun {DungeonRunInstance}
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(dungeonRun){

  const floor = dungeonRun.floor
  const room = dungeonRun.room
  const adventurerInstance = dungeonRun.adventurerInstance

  if(floor === 30 && room >= 100){
    return {
      message: `${adventurerInstance.name} gets bored and leaves.`,
      runFinished: true
    }
  }

  if(dungeonRun.user.accomplishments.firstRunFinished && foundStairs(floor, room)){
    return {
      nextRoom: 1,
      nextFloor: floor + 1,
      message: `${adventurerInstance.name} found the stairs and goes deeper.`
    }
  }

  if(foundMonster(dungeonRun)){
    const monster = await generateMonster(dungeonRun)
    // TODO: monsterInstance, adventurerInstance
    const combat = await generateCombat(
      new FighterInstance(adventurerInstance.adventurer, adventurerInstance.adventurerState, 1),
      new FighterInstance(monster, {}, 2),
      dungeonRun.floor
    )
    return {
      duration: combat.duration,
      stayInRoom: true,
      message: `${dungeonRun.adventurer.name} is fighting a ${monster.name}.`,
      combatID: combat._id,
      passTimeOverride: true,
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