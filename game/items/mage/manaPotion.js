import refreshCooldownsAction from '../../actions/refreshCooldownsAction.js'

export default {
  levelFn: level => {
    const amount = 10000 + level * 5000
    return {
      abilities: {
        active: {
          description: `Refresh your other cooldowns by ${Math.round(amount / 1000)}s.`,
          initialCooldown: 30000,
          actions: [
            refreshCooldownsAction({
              amountFlat: amount,
              excludeSelf: true
            })
          ]
        }
      }
    }
  },
  orbs: 5
}