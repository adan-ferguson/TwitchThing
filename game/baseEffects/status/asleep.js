export default function({ duration } = {}){
  return {
    polarity: 'debuff',
    stacking: 'extend',
    name: 'asleep',
    diminishingReturns: true,
    duration,
    mods: [{
      freezeActionBar: true
    }],
    // TODO: the sleep thing
  }
}