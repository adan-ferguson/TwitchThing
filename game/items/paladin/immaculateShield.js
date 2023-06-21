export default function(level){
  const block = 0.1 + level * 0.2
  return {
    orbs: level * 4 + 5,
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
            hasStatusEffectWithName: 'block'
          }
        }
      }]
    }
  }
}