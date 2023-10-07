export default function(level){
  const physPower = 8 + 2 * level
  const initialCooldown = Math.ceil(30000 * Math.pow(0.9, level - 1))
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        initialCooldown,
        resetAfterCombat: true,
        actions: [{
          attack: {
            scaling: {
              physPower
            },
            cantDodge: true,
            cantMiss: true,
          }
        }]
      }]
    },
  }
}