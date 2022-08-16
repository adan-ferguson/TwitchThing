import { generateRandomChest } from '../dungeons/chests.js'

const TIERS = [{
  message: advName => `${advName} solves a puzzle and is rewarded with some treasure.`
},{
  message: advName => `${advName} solves an extra tough puzzle and is rewarded with some extra valuable treasure.`
},{
  message: advName => `${advName} solves an extra tough puzzle and is rewarded with some extra valuable treasure.`
},{
  message: advName => `${advName} solves an extra tough puzzle and is rewarded with some extra valuable treasure.`
},{
  message: advName => `${advName} solves an extra tough puzzle and is rewarded with some extra valuable treasure.`
}]

export default {
  frequency: dungeonRun => 4 * dungeonRun.adventurerInstance.stats.get('chestFind').value,
  resolve: (dungeonRun, relicTier, value) => {
    return {
      rewards: {
        chests: generateRandomChest(dungeonRun, {
          tier: relicTier
        })
      },
      message: TIERS[relicTier].message
    }
  }
}