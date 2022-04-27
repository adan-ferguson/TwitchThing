import scaledValue from '../../game/scaledValue.js'
import { chooseOne } from '../../game/rando.js'
import { generateRandomChest } from './chests.js'

const BASE_RELIC_CHANCE = 0.2
const RELIC_CHANCE_SCALE = 0.03
const VALUE_MULTIPLIER = 0.25

export function foundRelic(dungeonRun){
  if(!dungeonRun.user.features.relics){
    return
  }
  const relicChance = dungeonRun.adventurerInstance.stats.get('relicFind').value * BASE_RELIC_CHANCE / scaledValue(RELIC_CHANCE_SCALE, dungeonRun.floor - 1)
  return Math.random() <= relicChance
}

export function generateRelicEvent(dungeonRun){
  return chooseOne([
    { weight: 40, value: minorRelic },
    { weight: 9, value: majorRelic },
    { weight: 50 - 50 * dungeonRun.adventurerInstance.hpPct, value: healingRelic },
    { weight: 7, value: chestRelic }
  ])(dungeonRun)
}

function minorRelic(dungeonRun){
  const xp = scaledValue(VALUE_MULTIPLIER, dungeonRun.floor, 30)
  return {
    relic: 'Minor',
    rewards: {
      xp: Math.floor(xp * (0.5 + Math.random() / 2))
    },
    message: `${dungeonRun.adventurerInstance.name} finds an interesting tablet and learns various things.`
  }
}

function majorRelic(dungeonRun){
  const xp = scaledValue(VALUE_MULTIPLIER, dungeonRun.floor, 150)
  return {
    relic: 'Major',
    rewards: {
      xp: Math.floor(xp * (0.5 + Math.random() / 2))
    },
    message: `${dungeonRun.adventurerInstance.name} discovers an ancient relic and gains enlightenment.`
  }
}

function healingRelic(dungeonRun){
  const newState = { ...dungeonRun.adventurerInstance.adventurerState }
  const gain = Math.floor(scaledValue(VALUE_MULTIPLIER, dungeonRun.floor, 25) * (0.5 + Math.random() / 2))
  newState.hp = Math.min(dungeonRun.adventurerInstance.hpMax, newState.hp + gain)
  return {
    relic: 'Healing',
    message: `${dungeonRun.adventurerInstance.name} finds a healing relic and regains ${gain} health.`,
    adventurerState: newState
  }
}

function chestRelic(dungeonRun){
  const newState = { ...dungeonRun.adventurerInstance.adventurerState }
  const gain = Math.ceil(dungeonRun.adventurerInstance.hpMax * (0.1 + Math.random() * 0.1))
  newState.hp = Math.min(dungeonRun.adventurerInstance.hpMax, newState.hp + gain)
  return {
    relic: 'Chest',
    rewards: {
      chests: generateRandomChest(dungeonRun)
    },
    message: `${dungeonRun.adventurerInstance.name} finds an abandoned relic with a treasure chest just sitting there.`,
  }
}