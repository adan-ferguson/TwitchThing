import removeStatusEffectAction from '../../actions/removeStatusEffectAction.js'

export default {
  levelFn: level => {
    return {
      stats: {
        startingFood: level
      },
      abilities: {
        rest: {
          description: `Cleanse ${level === 1 ? 'a debuff' : level + ' debuffs'} after resting.`,
          actions: [
            removeStatusEffectAction({
              count: level
            })
          ]
        }
      }
    }
  },
  orbs: 4
}