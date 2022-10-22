export default {
  stateParamsFn: ({ source, params = {} }) => {
    return {
      perStack: params.perStack
    }
  },
  defFn: (stateParams) => {
    return {
      stacking: true,
      stats: {
        physPower: stateParams.perStack
      }
    }
  }
}