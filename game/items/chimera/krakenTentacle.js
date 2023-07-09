export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'attackHit',
        actions: [{
          applyStatusEffect: {
            targets: 'enemy',
            statusEffect: {
              polarity: 'debuff',
              name: 'chilled',
              stats: {
                speed: -15 * level
              },
              stacking: 'stack'
            }
          }
        }]
      }]
    },
    orbs: level * 7 + 2
  }
}