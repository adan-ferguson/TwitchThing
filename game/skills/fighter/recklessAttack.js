export default function(level){
  const physPower = 1.3 + level * 1.1
  const turns = level
  return {
    effect: {
      abilities: [{
        trigger: { active: true },
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