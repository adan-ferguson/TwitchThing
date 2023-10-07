export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        turnRefund: 0.5,
        uses: 1 + level * 3,
        conditions: {
          owner: {
            hasDebuff: true
          }
        },
        actions: [{
          modifyStatusEffect: {
            subject: {
              polarity: 'debuff'
            },
            modification: {
              remove: true
            }
          }
        }]
      }]
    },
    orbs: 2 + level * 1
  }
}