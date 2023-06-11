export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        uses: 2 + level * 2,
        conditions: {
          owner: {
            hasDebuff: true
          }
        },
        actions: [{
          removeStatusEffect: {
            targets: 'self',
            polarity: 'debuff'
          }
        }]
      }]
    },
    orbs: 2 + level * 1
  }
}