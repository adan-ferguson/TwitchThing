import { chooseOne } from '../../game/rando.js'
import { generateRandomChest } from '../dungeons/chests.js'

const TIERS = {
  simple: {
    chance: 100,
    chestTier: 1,
    message: advName => `${advName} solves a puzzle and is rewarded with some treasure.`
  },
  intricate: {
    chance: 20,
    chestTier: 2,
    message: advName => `${advName} solves an extra tough puzzle and is rewarded with some extra valuable treasure.`
  },
  // perplexing: {
  //   chance: 5,
  //   message: advName => `${advName} figures out the message left from, I don't know, some ancient civilization or something.`
  // },
  // impossible: {
  //   chance: 0,
  //   message: advName => `The knowledge of the gods is imparted to ${advName} after they solve an impossible puzzle.`
  // }
}

export default {
  frequency: dungeonRun => 4 * dungeonRun.adventurerInstance.stats.get('chestFind').value,
  generate: dungeonRun => {
    return {
      difficulty: chooseOne(Object.keys(TIERS).map(name => {
        return { weight: TIERS[name].chance, value: name }
      }))
    }
  },
  resolve: (dungeonRun, event) => {
    const difficulty = event.relic.difficulty
    event.rewards = generateRandomChest(dungeonRun, {
      tier: TIERS[difficulty].chestTier
    })
    event.message = TIERS[difficulty].message
  }
}