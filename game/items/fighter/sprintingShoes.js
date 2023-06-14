export default function(level){
  const speed = 30 + level * 10
  const duration = 4000 + level * 1000
  return {
    effect: {
      abilities: [{
        trigger: 'startOfCombat',
        abilityId: 'sprinting',
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'sprinting',
              polarity: 'buff',
              duration,
              stats: {
                speed
              }
            }
          }
        }],
        vars: { speed, duration }
      }]
    },
    orbs: 2 + 2 * level
  }
}
