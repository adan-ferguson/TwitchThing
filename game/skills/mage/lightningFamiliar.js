export default function(level){
  const scaling = 0.3 + 0.3 * level
  return {
    effect: {
      abilities: [{
        trigger: 'useActiveAbility',
        actions: [{
          attack: {
            damageType: 'magic',
            scaling: {
              magicPower: scaling
            },
            range: [0,1]
          }
        }]
      }]
    },
    displayName: 'Lightning Familiar'
  }
}