export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: { active: true },
        uses: level + 1,
        conditions: {
          hpPctBelow: 0.5
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