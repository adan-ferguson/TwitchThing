import { gainHealth } from '../mechanics/gainHealth.js'
import { processAbilityEvents } from '../mechanics/abilities.js'

export function shouldRest(dungeonRun){
  if(['wandering','rest'].includes(dungeonRun.newestEvent.data.roomType)){
    // No doubles
    return
  }
  return dungeonRun.adventurerInstance.hpPct < dungeonRun.restThreshold / 100 && dungeonRun.adventurerInstance.food
}

export function rest(dungeonRun){

  const ai = dungeonRun.adventurerInstance
  const stayHungry = ai.hasMod('stayHungry')
  const change = stayHungry ? 1/2 : 1

  ai.food -= change
  processAbilityEvents(dungeonRun, 'rest', ai)

  const result = gainHealth(dungeonRun, ai, 1 + ai.hpMissing * (stayHungry ? 1/2 : 1))

  return {
    roomType: 'rest',
    penalty: {
      food: -change
    },
    rewards: {
      health: result.healthGained
    },
    message: `${dungeonRun.adventurerInstance.displayName} takes a break.`
  }
}