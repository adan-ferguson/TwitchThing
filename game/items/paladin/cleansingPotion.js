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