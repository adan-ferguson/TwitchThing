export default function(level){
  const scaling = 0.6 * level
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
    orbs: 3 + level * 3,
    displayName: 'Lightning Ring'
  }
}