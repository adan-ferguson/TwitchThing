export default function(level){
  const duration = 15000 * level
  return {
    effect: {
      abilities: [{
        trigger: 'startOfCombat',
        abilityId: 'divineIntervention',
        actions: [{
          applyStatusEffect: {
            targets: 'all',
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
