import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => ({
    stats: {
      startingFood: level
    },
    abilities: {
      rest: {
        actions: [
          statusEffectAction({
            effect: {
              isBuff: true,
              displayName: 'Caffeine Rush',
              stacking: 'replace',
              lingering: true,
              duration: 15000 + level * 5000,
              stats: {
                speed: 10 + 20 * level
              }
            }
          })
        ]
      }
    }
  }),
  displayName: 'Coffee Carafe',
  orbs: 3
}