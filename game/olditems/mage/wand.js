import { magicAttackMod } from '../../mods/combined.js'
import { leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      magicPower: leveledPctString(7, 3, level)
    },
    mods: [magicAttackMod]
  }),
  orbs: 1
}