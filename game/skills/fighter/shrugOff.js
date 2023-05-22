export default function(level){
  const cooldown = Math.ceil(40000 * Math.pow(0.8, level - 1))
  const heal = 0.4 + level * 0.1
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