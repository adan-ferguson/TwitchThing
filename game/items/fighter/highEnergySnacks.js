import statusEffectAction from '../../actions/statusEffectAction.js'
import { geometricProgession } from '../../exponentialValue.js'

export default {
  levelFn: level => ({
    abilities: {
      rest: {
        actions: [
          statusEffectAction({
            effect: {
              stacking: 'replace',
              combatOnly: false,
              stackingId: 'highEnergySnacks',
              duration: 45000 + level * 15000,
              stats: {
                speed: geometricProgession(0.10, level, 25, 5)
              }
            }
          })
        ]
      }
    }
  }),
  orbs: 3
}