import { roundToFixed } from '../../utilFunctions.js'
import takeDamage from '../../actions/damageSelfAction.js'

export default {
  stateParamsFn: ({ sourceEffect, params = {} }) => {
    return {
      dps: roundToFixed(sourceEffect.owner.magicPower * (params.damage ?? 0.03), 2)
    }
  },
  defFn: (stateParams, { stacks = 1 }) => {
    return {
      stacking: true,
      description: 'Taking damage per second',
      abilities: {
        tick: {
          actions: [
            takeDamage({
              damageType: 'magic',
              damage: stateParams.dps * stacks
            })
          ]
        }
      }
    }
  }
}