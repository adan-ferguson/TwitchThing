import { sneakAttackMod } from '../../mods/combined.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const obj = {
      mods: [sneakAttackMod]
    }
    if(level > 1){
      obj.stats = { physPower: leveledPercentageString( 0, 10, level ) }
    }
    return obj
  },
  orbs: 3,
  rarity: 1
}