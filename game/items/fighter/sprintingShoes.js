export default function(level){
  const speed = 15 + level * 15
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
    orbs: 1 + 2 * level
  }
}
