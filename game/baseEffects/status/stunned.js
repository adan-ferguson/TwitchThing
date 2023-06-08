export default function({ duration } = {}){
  return {
    polarity: 'debuff',
    stacking: 'replace',
    name: 'stunned',
    duration,
    mods: [{
      freezeActionBar: true
    }]
  }
}