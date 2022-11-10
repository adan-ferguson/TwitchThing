import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => ({
    abilities: {
      rest: {
        actions: [
          statusEffectAction({
            effect: {
              stacking: 'replace',
              stackingId: 'highEnergySnacks',
              duration: 45000 + level * 15000,
              stats: {
                speed: level * 25
              }
            }
          })
        ]
      }
    }
  }),
  orbs: 3
}