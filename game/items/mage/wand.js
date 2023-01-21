import { magicAttackMod } from '../../mods/combined.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      magicPower: leveledPercentageString(5, 5, level)
    },
    mods: [magicAttackMod]
  }),
  orbs: 1
}