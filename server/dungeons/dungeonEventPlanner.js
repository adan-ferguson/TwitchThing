import { generateMonster } from '../monster/generator.js'
import { generateCombat } from '../combat/combat.js'

/**
 * @param adventurer
 * @param dungeonRun
 * @param room
 * @param floor
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(adventurer, dungeonRun, room, floor){

  if(dungeonRun.events.length >= 100){
    return {
      finished: true,
      message: 'You leave because it\'s really boring.'
    }
  }

  if(foundStairs(floor, room)){
    return {
      stairs: true,
      message: `${adventurer.name} found the stairs and goes deeper.`
    }
  }

  if(foundMonster(dungeonRun)){
    const monster = await generateMonster(floor)
    const combat = await generateCombat(adventurer, monster, dungeonRun.adventurerState)
    return {
      duration: combat.duration,
      pending: true,
      combatID: combat._id,
      monster: true
    }
  }

  return {
    rewards: {
      xp: Math.floor(3 * dungeonRun.floor + 3 * dungeonRun.floor * Math.random())
    },
    message: `${adventurer.name} finds an ancient tablet and learns various things.`
  }
}

function foundStairs(floor, room){
  const stairsChance = (-5 + room) / (5 + floor)
  return Math.random() < stairsChance
}

function foundMonster(dungeonRun){
  const monsterChance = (-3 + roomsSinceMonster()) / 20
  return Math.random() < monsterChance
  function roomsSinceMonster(){
    let i
    for(i = 1; i <= dungeonRun.events.length; i++){
      if(dungeonRun.events.at(-i)?.monster){
        break
      }
    }
    return i
  }
}