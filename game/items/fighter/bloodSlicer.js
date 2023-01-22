import physScaling from '../../mods/generic/physScaling.js'
import { critChanceStat } from '../../stats/combined.js'
import gainHealthAction from '../../actions/gainHealthAction.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const pct = 0.3
    return {
      abilities: {
        crit: {
          description: `${pct * 100}% lifesteal on crits.`,
          actions: [
            ({ triggerData }) => {
              const damageJustDealt = triggerData.damageResultData.totalDamage
              if(damageJustDealt > 0){
                return gainHealthAction({
                  scaling: { flat: damageJustDealt * pct }
                })
              }
            }
          ]
        }
      },
      stats: {
        [critChanceStat.name]: 0.22 + level * 0.03,
        hpMax: leveledPercentageString(20, 10, level)
      },
      mods: [physScaling]
    }
  },
  orbs: 10
}