export default function({ duration } = {}){
  return {
    polarity: 'debuff',
    stacking: 'extend',
    name: 'charmed',
    duration,
    mods: [{
      noAttack: true
    }]
  }
}