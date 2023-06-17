export default function({ duration } = {}){
  return {
    polarity: 'debuff',
    stacking: 'extend',
    name: 'stunned',
    duration,
    diminishingReturns: true,
    mods: [{
      freezeActionBar: true
    }]
  }
}