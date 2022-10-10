import { roundToFixed } from '../../utilFunctions.js'
import takeDamage from '../../actions/generic/takeDamage.js'

export default {
  stateParamsFn: ({ source, params = {} }) => {
    return {
      dps: roundToFixed(source.magicPower * (params.damage ?? 1), 2)
    }
  },
  defFn: (stateParams, { stacks = 1 }) => {
    return {
      stacking: true,
      combatOnly: false,
      abilities: {
        tick: {
          actions: [
            takeDamage({
              damageType: 'magic',
              damage: stateParams.dps * stacks,
              useDecimals: true
            })
          ]
        }
      }
    }
  }
}