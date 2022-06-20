import { generateRandomChest } from '../dungeons/chests.js'

const TIERS = [{
  chestTier: 1,
  message: advName => `${advName} solves a puzzle and is rewarded with some treasure.`
},{
  chestTier: 2,
  message: advName => `${advName} solves an extra tough puzzle and is rewarded with some extra valuable treasure.`
},{
  chestTier: 2,
  message: advName => `${advName} solves an extra tough puzzle and is rewarded with some extra valuable treasure.`
},{
  chestTier: 2,
  message: advName => `${advName} solves an extra tough puzzle and is rewarded with some extra valuable treasure.`
},{
  chestTier: 2,
  message: advName => `${advName} solves an extra tough puzzle and is rewarded with some extra valuable treasure.`
}]

export default {
  frequency: dungeonRun => 4 * dungeonRun.adventurerInstance.stats.get('chestFind').value,
  resolve: (dungeonRun, relicTier, value) => {
    return {
      rewards: {
        chests: generateRandomChest(dungeonRun, {
          tier: TIERS[relicTier].chestTier
        })
      },
      message: TIERS[relicTier].message
    }
  }
}