const TIERS = [
  {
    multiplier: 60,
    message: advName => `${advName} solves the relic puzzle and learns a bit.`
  },{
    multiplier: 150,
    message: advName => `${advName} solves the relic puzzle and learns a lot!`
  },{
    multiplier: 450,
    message: advName => `${advName} gets a new high score and gains a ton of xp!`
  },{
    multiplier: 1800,
    message: advName => `${advName} learns ancient secrets from, I don't know, some ancient civilization or something.`
  },{
    multiplier: 10000,
    message: advName => `WOW! ${advName} solved the impossible relic! They gain probably way too much xp and breaks the game!`
  }
]

export default {
  frequency: () => 50,
  resolve: (dungeonRun, relicTier, value) => {
    const xp = Math.ceil(TIERS[relicTier].multiplier * value)
    return {
      rewards: {
        xp: Math.floor(xp * (0.5 + Math.random() / 2))
      },
      message: TIERS[relicTier].message(dungeonRun.adventurerInstance.displayName)
    }
  }
}