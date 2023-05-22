export default function(level){
  const cooldown = Math.ceil(60000 * Math.pow(0.8, level - 1))
  const heal = 0.2 + level * 0.05
  return {
    effect: {
      abilities: [{
        trigger: { gainingDebuff: true },
        abilityId: 'shrugOff',
        cooldown,
        replacements: {
          dataMerge: {
            cancelled: true
          }
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