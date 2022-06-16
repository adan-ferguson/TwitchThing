import { generateRandomChest } from '../dungeons/chests.js'
import scaledValue from '../../game/scaledValue.js'
import { chooseOne } from '../../game/rando.js'

const VALUE_MULTIPLIER = 0.25

export default {
  knowledge: {
    frequency: () => 50,
    generate: dungeonRun => {
      return {
        difficulty: chooseOne({
          simple: 100,
          intricate: 20,
          perplexing: 5,
          impossible: 1
        })
      }
    },
    resolve: (dungeonRun, event) => {
      const difficulty = event.relic.difficulty
      const name = dungeonRun.adventurerInstance.name
      const multipliers = {
        simple: 30,
        intricate: 100,
        perplexing: 300,
        impossible: 1000
      }
      const xp = Math.ceil(multipliers[difficulty] * relicValue(dungeonRun))
      event.rewards = {
        xp: Math.floor(xp * (0.5 + Math.random() / 2))
      }
      event.message = `${name} finds an interesting tablet and learns various things.`
    }
  },
  healing: {
    frequency: dungeonRun => 50 - 50 * dungeonRun.adventurerInstance.hpPct,
    generate: dungeonRun => {

    },
    resolve: (dungeonRun, event) => {

    }
  },
  treasure: {
    frequency: dungeonRun => 4 * dungeonRun.adventurerInstance.stats.get('chestFind').value,
    generate: dungeonRun => {

    },
    resolve: (dungeonRun, event) => {

    }
  }
}

function healingRelic(dungeonRun){
  const newState = { ...dungeonRun.adventurerInstance.adventurerState }
  const gain = Math.floor(10 * relicValue(dungeonRun) * 10 * (0.5 + Math.random() / 2))
  const finalGain = Math.min(dungeonRun.adventurerInstance.hpMax - newState.hp, gain)
  newState.hp += finalGain
  return {
    relic: 'Healing',
    message: `${dungeonRun.adventurerInstance.name} finds a healing relic and regains ${finalGain} health.`,
    adventurerState: newState
  }
}

function chestRelic(dungeonRun){
  return {
    relic: 'Chest',
    rewards: {
      chests: generateRandomChest(dungeonRun)
    },
    message: `${dungeonRun.adventurerInstance.name} finds a puzzle relic.`,
  }
}

function relicValue(dungeonRun){
  return scaledValue(VALUE_MULTIPLIER, dungeonRun.floor, dungeonRun.adventurerInstance.stats.get('relicQuality')).value
}