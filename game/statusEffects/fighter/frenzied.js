export default {
  stateParamsFn: ({ source, params = {} }) => {
    return {
      perStack: params.perStack
    }
  },
  defFn: (stateParams, stacks) => {
    return {
      stacking: true,
      stats: {
        physPower: stateParams.perStack * stacks
      }
    }
  }
}