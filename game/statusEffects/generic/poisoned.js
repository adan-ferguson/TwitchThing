import { roundToFixed } from '../../utilFunctions.js'
import takeDamage from '../../actions/damageSelfAction.js'

export default {
  stateParamsFn: ({ sourceEffect, params = {} }) => {
    return {
      dps: roundToFixed(sourceEffect.owner.magicPower * (params.damage ?? 0.2), 2)
    }
  },
  defFn: (stateParams, { stacks = 1 }) => {
    const damage = stateParams.dps * stacks
    return {
      stacking: true,
      description: `Taking [magicFlat${damage}] damage every 5 seconds`,
      abilities: {
        tick: {
          initialCooldown: 5000,
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