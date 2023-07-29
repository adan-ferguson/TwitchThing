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
              maxStacks: 4 + level * 1,
              stats: {
                speed: 8 + level * 2
              }
            }
          }
        }]
      }]
    },
    orbs: 2 + level * 1,
    displayName: 'Wolf Claws'
  }
}