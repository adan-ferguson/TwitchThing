import { roundToFixed } from '../../utilFunctions.js'
import takeDamageAction from '../../actions/actionDefs/common/takeDamageAction.js'

export default {
  stateParamsFn: ({ sourceEffect, params = {} }) => {
    if(!params.damage){
      throw 'Missing mandatory param "damage".'
    }
    const damageType = params.damageType ?? 'magic'
    const dps = roundToFixed(sourceEffect.owner[damageType + 'Power'] * params.damage, 1)
    return { dps, damageType }
  },
  defFn: (stateParams, { stacks = 1 }) => {
    const damage = stateParams.dps * stacks
    return {
      stacking: true,
      description: 'Taking damage over time.',
      abilities: {
        tick: {
          initialCooldown: 1000,
          actions: [
            takeDamageAction({
              scaling: {
                flat: damage
              },
              damageType: stateParams.damageType
            })
          ]
        }
      }
    }
  }
}