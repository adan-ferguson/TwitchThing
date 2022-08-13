export default {
  frequency: dungeonRun => 70 - 70 * dungeonRun.adventurerInstance.hpPct,
  resolve: (dungeonRun, relicTier, value) => {
    const gain = Math.floor(value * 16 * (0.5 + Math.random() / 2)) * (1 + relicTier * 0.5)
    const newState = { ...dungeonRun.adventurerInstance.adventurerState }
    const finalGain = Math.min(dungeonRun.adventurerInstance.hpMax - newState.hp, gain)
    newState.hp += finalGain
    return {
      adventurerState: newState,
      message: `${dungeonRun.adventurerInstance.name} finds a healing relic and regains some health.`
    }
  }
}