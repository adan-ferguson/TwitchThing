import { bossMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'

export default {
  baseStats: {
    physPower: '+10%',
    speed: -20,
    hpMax: '+180%'
  },
  items: [
    {
      name: 'Boss',
      mods: [bossMod]
    },{
      name: 'Execute',
      abilities: {
        active: {
          initialCooldown: 30000,
          actions: [
            attackAction({
              damageMulti: 5
            })
          ]
        }
      }
    }
  ]
}