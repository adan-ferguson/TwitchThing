import { roundToFixed } from '../../utilFunctions.js'
import takeDamage from '../../actions/damageSelfAction.js'

export default {
  stateParamsFn: ({ sourceEffect, params = {} }) => {
    return {
      dps: roundToFixed(sourceEffect.owner.magicPower * (params.damage ?? 0.1), 2)
    }
  },
  defFn: (stateParams, { stacks = 1 }) => {
    const damage = stateParams.dps * stacks
    return {
      stacking: true,
      description: `Taking [magicFlat${damage}] damage every second.`,
      abilities: {
        tick: {
          initialCooldown: 1000,
          actions: [
            takeDamage({
              damageType: 'magic',
              damage
            })
          ]
        }
      }
    }
  }
}