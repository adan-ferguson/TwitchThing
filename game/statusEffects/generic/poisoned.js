import { selfDamageAction } from '../../actions.js'

export default {
  stateParamsFn: ({ source, params = {} }) => {
    return {
      dps: source.magicPower * (params.damage ?? 1)
    }
  },
  defFn: stateParams => {
    return {
      stacking: true,
      combatOnly: false,
      ability: {
        type: 'triggered',
        trigger: 'tick',
        actions: [
          selfDamageAction({
            damageType: 'magic',
            damage: stateParams.dps
          })
        ]
      }
    }
  }
}