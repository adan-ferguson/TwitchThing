export default function(level){
  const block = 0.1 + level * 0.2
  return {
    orbs: level * 6 + 4,
    effect: {
      stats: {
        block
      },
      abilities: [{
        trigger: 'gainingDebuff',
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