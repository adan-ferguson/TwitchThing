import physScaling from '../../mods/generic/physScaling.js'
import { critChanceStat } from '../../stats/combined.js'
import gainHealthAction from '../../actions/gainHealthAction.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const pct = 0.5
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
        [critChanceStat.name]: 0.25 + level * 0.05,
        hpMax: leveledPercentageString(35, 15, level)
      },
      mods: [physScaling]
    }
  },
  orbs: 10
}