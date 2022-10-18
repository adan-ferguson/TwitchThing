import { roundToFixed } from '../../utilFunctions.js'
import takeDamage from '../../actions/takeDamage.js'

export default {
  stateParamsFn: ({ source, params = {} }) => {
    return {
      dps: roundToFixed(source.magicPower * (params.damage ?? 0.03), 2)
    }
  },
  defFn: (stateParams, { stacks = 1 }) => {
    return {
      stacking: true,
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