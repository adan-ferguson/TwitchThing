export default function(level){
  const physPower = 2.5 + level * 1.5
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