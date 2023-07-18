export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'thwart',
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              polarity: 'buff',
              turns: level,
              name: 'An Opening!',
              stacking: 'replace',
              stats: {
                critChance: 1
              }
            }
          }
        }]
      }]
    },
    displayName: 'An Opening!'
  }
}