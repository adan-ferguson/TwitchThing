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
              duration: 15000,
              stats: {
                speed: 25 + level * 5
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