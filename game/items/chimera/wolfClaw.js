export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'attackHit',
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'frenzy',
              polarity: 'buff',
              stacking: 'stack',
              maxStacks: 3 + level * 2,
              stats: {
                speed: 8 + level * 2
              }
            }
          }
        }]
      }]
    },
    orbs: 2 + level * 2
  }
}