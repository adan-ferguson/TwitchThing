export default function(level){
  const initialCooldown = Math.ceil(10000 * Math.pow(0.9, level - 1))
  const hpMissing = 0.08 + level * 0.02
  return {
    effect: {
      abilities: [{
        trigger: 'instant',
        initialCooldown,
        actions: [{
          gainHealth: {
            scaling: {
              hpMissing
            }
          }
        }]
      }]
    },
    displayName: 'Troll Regeneration',
    orbs: 3 + level * 3
  }
}