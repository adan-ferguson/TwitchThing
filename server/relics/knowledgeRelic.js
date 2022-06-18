const TIERS = {
  simple: {
    multiplier: 30,
    message: advName => `${advName} learns some things from the relic.`
  },
  intricate: {
    multiplier: 70,
    message: advName => `${advName} painstakingly translates the relic's rune and learns a lot.`
  },
  complex: {
    multiplier: 180,
    message: advName => `${advName} painstakingly translates the relic's rune and learns a lot.`
  },
  perplexing: {
    multiplier: 1000,
    message: advName => `${advName} figures out the message left from, I don't know, some ancient civilization or something.`
  },
  impossible: {
    multiplier: 12000,
    message: advName => `The knowledge of the gods is imparted to ${advName} after they solve an impossible puzzle.`
  }
}

export default {
  frequency: () => 50,
  resolve: (dungeonRun, relicTier, value) => {
    const xp = Math.ceil(TIERS[relicTier].multiplier * value)
    return {
      rewards: {
        xp: Math.floor(xp * (0.5 + Math.random() / 2))
      },
      message: TIERS[relicTier].message(dungeonRun.adventurerInstance.name)
    }
  }
}