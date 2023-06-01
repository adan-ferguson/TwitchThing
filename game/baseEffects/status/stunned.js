export default function(duration){
  return {
    polarity: 'debuff',
    stacking: 'replace',
    duration,
    mods: [{
      freezeActionBar: true
    }]
  }
}