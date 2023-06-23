export default function(level){
  const physPower = 1.8 + level * 1.2
  const turns = level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 12000,
        actions: [{
          attack: {
            scaling: {
              physPower
            }
          }
        },{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'wideOpen',
              turns,
              polarity: 'debuff',
              stacking: 'extend',
              persisting: true,
              mods: [{
                autoCritAgainst: true
              }]
            }
          }
        }]
      }]
    }
  }
}