export default function(level){
  const block = level * 0.30
  return {
    orbs: level * 8 + 4,
    effect: {
      stats: {
        block
      },
      abilities: [{
        trigger: 'gainingDebuff',
        abilityId: 'immaculateShield',
        replacements: {
          cancel: 'No Debuffs'
        },
        conditions: {
          owner: {
            hasStatusEffect: {
              name: 'block'
            }
          }
        }
      }]
    }
  }
}