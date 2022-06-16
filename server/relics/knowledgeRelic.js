import { chooseOne } from '../../game/rando.js'

const TIERS = {
  simple: {
    chance: 100,
    multiplier: 30,
    message: advName => `${advName} learns some things from the relic.`
  },
  intricate: {
    chance: 20,
    multiplier: 100,
    message: advName => `${advName} painstakingly translates the relic's rune and learns a lot.`
  },
  perplexing: {
    chance: 5,
    multiplier: 300,
    message: advName => `${advName} figures out the message left from, I don't know, some ancient civilization or something.`
  },
  impossible: {
    chance: 1,
    multiplier: 2500,
    message: advName => `The knowledge of the gods is imparted to ${advName} after they solve an impossible puzzle.`
  }
}

export default {
  frequency: () => 50,
  generate: dungeonRun => {
    return {
      difficulty: chooseOne(Object.keys(TIERS).map(name => {
        return { weight: TIERS[name].chance, value: name }
      }))
    }
  },
  resolve: (dungeonRun, event, value) => {
    const difficulty = event.relic.difficulty
    const xp = Math.ceil(TIERS[difficulty].multiplier * value)
    event.rewards = {
      xp: Math.floor(xp * (0.5 + Math.random() / 2))
    }
    event.message = TIERS[difficulty].message(dungeonRun.adventurerInstance.name)
  }
}