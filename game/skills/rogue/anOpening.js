export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'thwart',
        conditions: {
          data: {
            isAttack: true // TODO: ?
          }
        },
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              polarity: 'buff',
              turns: 1,
              name: 'An Opening!',
              stats: {
                critChance: 1
              }
            }
          }
        }]
      }]
    },
    maxLevel: 1,
    displayName: 'An Opening!'
  }
}