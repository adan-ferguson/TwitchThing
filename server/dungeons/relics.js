import scaledValue from '../../game/scaledValue.js'
import { chooseOne } from '../../game/rando.js'

const BASE_RELIC_CHANCE = 0.2
const RELIC_CHANCE_SCALE = 0.03
const VALUE_MULTIPLIER = 0.10

export function foundRelic(adventurerInstance, dungeonRun){
  const relicChance = adventurerInstance.stats.get('relicFind').convertedValue * BASE_RELIC_CHANCE / scaledValue(RELIC_CHANCE_SCALE, dungeonRun.floor - 1)
  return Math.random() <= relicChance
}

export function generateRelicEvent(adventurerInstance, dungeonRun){
  return chooseOne([
    { weight: 40, value: minorRelic },
    { weight: 10, value: majorRelic },
    { weight: 70 - 70 * adventurerInstance.hpPct, value: healingRelic }
  ])(adventurerInstance, dungeonRun)
}

function minorRelic(adventurerInstance, dungeonRun){
  const xp = Math.floor(scaledValue(VALUE_MULTIPLIER, dungeonRun.floor, 10))
  return {
    rewards: {
      xp: xp * (0.5 + Math.random() / 2)
    },
    message: `${adventurerInstance.name} finds an interesting tablet and learns various things.`
  }
}

function majorRelic(adventurerInstance, dungeonRun){
  const xp = Math.floor(scaledValue(VALUE_MULTIPLIER, dungeonRun.floor, 50))
  return {
    rewards: {
      xp: xp * (0.5 + Math.random() / 2)
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