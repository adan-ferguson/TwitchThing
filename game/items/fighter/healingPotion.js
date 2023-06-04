export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        uses: level + 1,
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
    orbs: level * 2
  }
}