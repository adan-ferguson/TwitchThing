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
    abilities: [{
      trigger: 'takeDamage',
      actions: [{
        modifyStatusEffect: {
          subject: {
            key: 'self'
          },
          modification: {
            remove: true
          }
        }
      }]
    }]
  }
}