import scaledValue from '../../game/scaledValue.js'
import randoJando from '../../game/randoJando.js'

const RELIC_CHANCE = 0.2
const VALUE_MULTIPLIER = 0.08

export function foundRelic(adventurerInstance, dungeonRun){
  return Math.random() <= RELIC_CHANCE
}

export function generateRelicEvent(adventurerInstance, dungeonRun){
  debugger
  return randoJando([
    { weight: 40, fn: minorRelic },
    { weight: 10, fn: majorRelic },
    { weight: 50 - 50 * adventurerInstance.hpPct, fn: healingRelic }
  ], [adventurerInstance, dungeonRun])
}

function minorRelic(adventurerInstance, dungeonRun){
  return {
    rewards: {
      xp: Math.floor(scaledValue(VALUE_MULTIPLIER, dungeonRun.floor, 10) * (0.5 + Math.random() / 2))
    },
    message: `${adventurerInstance.name} finds an interesting tablet and learns various things.`
  }
}

function majorRelic(adventurerInstance, dungeonRun){
  return {
    rewards: {
      xp: Math.floor(scaledValue(VALUE_MULTIPLIER, dungeonRun.floor, 50) * (0.5 + Math.random() / 2))
    },
    message: `${adventurerInstance.name} discovers an ancient relic and gains enlightenment.`
  }
}

function healingRelic(adventurerInstance, dungeonRun){
  const newState = { ...adventurerInstance.adventurerState }
  const gain = adventurerInstance.hpMax * (0.15 + Math.random() * 0.15)
  newState.hp = Math.min(adventurerInstance.hpMax, newState.hp + gain)
  return {
    message: `${adventurerInstance.name} finds a healing relic and regains some health.`,
    adventurerState: adventurerInstance.adventurerState
  }
}