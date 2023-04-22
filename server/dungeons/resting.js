import { gainHealth } from '../mechanics/gainHealth.js'
import { processAbilityEvents } from '../mechanics/abilities.js'

export function shouldRest(dungeonRun){
  return dungeonRun.adventurerInstance.hpPct < dungeonRun.restThreshold / 100 && dungeonRun.adventurerInstance.food
}

export function rest(dungeonRun){

  const ai = dungeonRun.adventurerInstance
  ai.food--

  processAbilityEvents(dungeonRun, 'rest', ai)
  const result = gainHealth(null, ai, { hpMissingPct: 1 })

  return {
    roomType: 'rest',
    penalty: {
      food: -1
    },
    rewards: {
      health: result.amount
    },
    message: `${dungeonRun.adventurerInstance.displayName} takes a break.`
  }
}