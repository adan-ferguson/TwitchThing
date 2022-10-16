export default {
  stateParamsFn: ({ source, params = {} }) => {
    return {
      barrierPoints: Math.ceil(source.magicPower * (params.power ?? 1))
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