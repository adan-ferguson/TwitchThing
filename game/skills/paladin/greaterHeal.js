export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 20000 * Math.pow(0.8, level - 1),
        conditions: {
          owner: {
            hpPctBelow: 0.5
          }
        },
        actions: [{
          gainHealth: {
            scaling: {
              magicPower: 2.4 + 0.6 * level
            }
          }
        }]
      }]
    },
  }
}