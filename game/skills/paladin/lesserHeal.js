export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        turnRefund: 0.5,
        cooldown: 12000 * Math.pow(0.85, level - 1),
        actions: [{
          gainHealth: {
            scaling: {
              magicPower: 0.5 + 0.2 * level
            }
          }
        }]
      }]
    },
    displayName: 'Lesser Heal',
  }
}