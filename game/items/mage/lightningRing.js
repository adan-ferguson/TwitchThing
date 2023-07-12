export default function(level){
  const scaling = 0.25 + 0.25 * level
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
    orbs: 1 + level * 3,
    displayName: 'Lightning Ring'
  }
}