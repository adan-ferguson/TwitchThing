export default function({ duration } = {}){
  return {
    polarity: 'debuff',
    stackingId: 'blinded',
    stacking: 'extend',
    name: 'blinded',
    duration,
    diminishingReturns: true,
    abilities: [{
      trigger: 'attack',
      replacements: {
        cancel: 'Missed'
      }
    }]
  }
}