import { gainHealth } from '../mechanics/gainHealth.js'
import { processAbilityEvents } from '../mechanics/abilities.js'

export function shouldRest(dungeonRun){
  if(dungeonRun.newestEvent.roomType === 'rest'){
    // No doubles
    return
  }
  return dungeonRun.adventurerInstance.hpPct < dungeonRun.restThreshold / 100 && dungeonRun.adventurerInstance.food
}

export function rest(dungeonRun){

  const ai = dungeonRun.adventurerInstance
  const stayHungry = ai.hasMod('stayHungry')

  ai.food -= stayHungry ? 1/2 : 1
  processAbilityEvents(dungeonRun, 'rest', ai)

  const result = gainHealth(dungeonRun, ai, 1 + ai.hpMissing * (stayHungry ? 1/2 : 1))

  return {
    roomType: 'rest',
    penalty: {
      food: -1
    },
    rewards: {
      health: result.healthGained
    },
    message: `${dungeonRun.adventurerInstance.displayName} takes a break.`
  }
}