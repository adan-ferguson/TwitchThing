export default function({ duration } = {}){
  return {
    polarity: 'debuff',
    stacking: 'extend',
    name: 'asleep',
    duration,
    mods: [{
      freezeActionBar: true
    }],
    // TODO: the sleep thing
  }
}