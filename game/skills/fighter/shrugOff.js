export default function(level){
  const cooldown = Math.ceil(30000 * Math.pow(0.7, level - 1))
  const heal = 0.25 + level * 0.05
  return {
    effect: {
      abilities: [{
        trigger: 'gainingDebuff',
        abilityId: 'shrugOff',
        cooldown,
        replacements: {
          cancel: 'shrugOff'
        },
        actions: [{
          gainHealth: {
            scaling: {
              physPower: heal
            }
          }
        }]
      }]
    }
  }
}