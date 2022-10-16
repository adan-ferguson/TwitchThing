export default {
  stateParamsFn: ({ source, params = {} }) => {
    return {
      barrierPoints: Math.ceil(source.magicPower * (params.power ?? 1))
    }
  },
  defFn: stateParams => {
    return {
      stacking: 'refresh',
      barrier: {
        points: stateParams.barrierPoints
      }
    }
  }
}