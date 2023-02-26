import scaledNumber from '../../scaledNumber.js'

export default {
  stateParamsFn: ({ sourceEffect, params = {} }) => {
    return {
      barrierPoints: Math.ceil(scaledNumber(sourceEffect.owner, params))
    }
  },
  defFn: stateParams => {
    return {
      stacking: 'replace',
      isBuff: true,
      displayName: 'Barrier',
      barrier: {
        points: stateParams.barrierPoints
      }
    }
  }
}