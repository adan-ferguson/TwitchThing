export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        uses: 1 + level * 2,
        conditions: {
          owner: {
            hpPctBelow: 0.5
          }
        },
        actions: [{
          gainHealth: {
            scaling: {
              hpMax: 0.5
            }
          }
        }]
      }]
    },
    displayName: 'Health Potion',
    orbs: level * 1 + 1
  }
}