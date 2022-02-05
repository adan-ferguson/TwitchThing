import { generateMonsterCombat } from '../collections/combat.js'

/**
 * @param adventurer
 * @param dungeonRun
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(adventurer, dungeonRun){

  // TODO: check if combat should end

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
    const combat = await generateMonsterCombat(adventurer, dungeonRun)
    return {
      combat: {
        id: combat.id,
        state: 'running',
        monster: combat.monster
      }
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
  if(room < 5){
    return
  }
  const stairsChance = room / (5 + floor)
  return Math.random() < stairsChance
}

function foundMonster(dungeonRun){
  const monsterChance = roomsSinceMonster() / 25
  return Math.random < monsterChance
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