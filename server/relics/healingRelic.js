import { gainHealth } from '../actionsAndTicks/common.js'

export default {
  frequency: dungeonRun => 70 - 70 * dungeonRun.adventurerInstance.hpPct,
  resolve: (dungeonRun, relicTier, value) => {
    const gain = Math.floor(value * 12 * (0.5 + Math.random() / 2)) * (1 + relicTier * 0.5)
    const result = gainHealth(dungeonRun.adventurerInstance, gain)
    const finalGain = result?.amount ?? 0
    return {
      message: `The healing relic bathes ${dungeonRun.adventurerInstance.displayName} in a healing light, regaining ${finalGain} health.`
    }
  }
}