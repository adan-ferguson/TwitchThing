export default function(level){
  const speed = 30 + level * 20
  const duration = 5000
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
