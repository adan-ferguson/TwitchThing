export default {
  stateParamsFn: ({ sourceEffect, params }) => {
    const slot = params.slot === 'opposing' ? sourceEffect.slot : params.slot
    return {
      slot: slot ?? -1 // -1 is no items
    }
  },
  defFn: (stateParams) => {
    return {
      stacking: 'replace',
      description: `Slot ${stateParams.slot} item is disabled.`,
      disarmedItemSlot: stateParams.slot
    }
  }
}