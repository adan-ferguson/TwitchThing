import refreshCooldownsAction from '../../actions/refreshCooldownsAction.js'

export default {
  levelFn: level => {
    const amount = 5000 + level * 5000
    return {
      stats: {
        startingFood: level
      },
      abilities: {
        rest: {
          description: `After resting, refresh your cooldowns by ${Math.round(amount / 1000)}s.`,
          actions: [
            refreshCooldownsAction({
              amountFlat: amount
            })
          ]
        }
      }
    }
  },
  orbs: 6
}