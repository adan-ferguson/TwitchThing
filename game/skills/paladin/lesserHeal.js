export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        turnRefund: 0.5,
        cooldown: 12000,
        actions: [{
          gainHealth: {
            scaling: {
              magicPower: 0.4 + 0.4 * level
            }
          }
        }]
      }]
    },
    displayName: 'Lesser Heal',
  }
}