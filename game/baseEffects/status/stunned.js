export default function({ duration } = {}){
  return {
    polarity: 'debuff',
    stacking: 'extend',
    name: 'stunned',
    duration,
    mods: [{
      freezeActionBar: true
    }]
  }
}