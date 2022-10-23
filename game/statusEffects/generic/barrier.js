export default {
  stateParamsFn: ({ sourceEffect, params = {} }) => {
    return {
      barrierPoints: Math.ceil(sourceEffect.owner.magicPower * (params.power ?? 1))
    }
  },
  defFn: stateParams => {
    return {
      stacking: 'refresh',
      isBuff: true,
      barrier: {
        points: stateParams.barrierPoints
      }
    }
  }
}