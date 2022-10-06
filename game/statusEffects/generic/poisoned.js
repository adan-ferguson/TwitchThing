import { takeDamageAction } from '../../actions.js'
import { roundToFixed } from '../../utilFunctions.js'

export default {
  stateParamsFn: ({ source, params = {} }) => {
    return {
      dps: roundToFixed(source.magicPower * (params.damage ?? 1), 2)
    }
  },
  defFn: (stateParams, { stacks }) => {
    return {
      stacking: false,
      combatOnly: false,
      ability: {
        type: 'triggered',
        trigger: 'tick',
        actions: [
          takeDamageAction({
            damageType: 'magic',
            damage: stateParams.dps * stacks,
            useDecimals: true
          })
        ]
      }
    }
  }
}