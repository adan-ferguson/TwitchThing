import { generateMonster } from '../monster/generator.js'
import { generateCombat } from '../combat/combat.js'

/**
 * @param adventurer
 * @param dungeonRun
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(adventurer, dungeonRun){

  if(dungeonRun.events.length >= 100){
    return {
      finished: true,
      message: 'You leave because it\'s really boring.'
    }
  }

  if(foundStairs(dungeonRun.floor, dungeonRun.room)){
    return {
      stairs: true,
      message: `${adventurer.name} found the stairs and goes deeper.`
    }
  }

  if(foundMonster(dungeonRun)){
    const monster = await generateMonster(dungeonRun.floor)
    const combat = await generateCombat(adventurer, monster, dungeonRun.adventurerState)
    return {
      duration: combat.duration,
      pending: true,
      combat: combat._id
    }
  }

  return {
    rewards: {
      xp: 20 + Math.floor(11 * Math.random())
    },
    message: `${adventurer.name} finds an ancient tablet and learns various things.`
  }
}

function foundStairs(floor, room){
  if(room < 10){
    return
  }
  const stairsChance = room / (10 + floor)
  return Math.random() < stairsChance
}

function foundMonster(dungeonRun){
  const monsterChance = roomsSinceMonster() / 25
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