import { performGainHealthAction, triggerEvent } from '../actionsAndTicks/common.js'

export function shouldRest(dungeonRun){
  return dungeonRun.adventurerInstance.hpPct < dungeonRun.restThreshold / 100 && dungeonRun.adventurerInstance.food
}

export function rest(dungeonRun){

  const ai = dungeonRun.adventurerInstance
  const hpBefore = ai.hp
  const results = []
  ai.food--
  results.push(performGainHealthAction(null, ai, { scaling: { hpMax: 0.35 } }))
  results.push(...triggerEvent(null, ai, 'rest'))

  return {
    results,
    roomType: 'rest',
    penalty: {
      food: -1
    },
    rewards: {
      health: ai.hp - hpBefore
    },
    message: `${dungeonRun.adventurerInstance.displayName} takes a break.`
  }
}