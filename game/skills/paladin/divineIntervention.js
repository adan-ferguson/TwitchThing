export default function(level){
  const duration = 5000 + 5000 * level
  return {
    effect: {
      abilities: [{
        trigger: 'startOfCombat',
        abilityId: 'divineIntervention',
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'Divine Intervention',
              polarity: 'buff',
              duration,
              stats: {
                damageTaken: '-100%'
              }
            }
          }
        }],
      }]
    },
    maxLevel: 4
  }
}
