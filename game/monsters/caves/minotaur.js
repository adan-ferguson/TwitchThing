import { bossMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'

export default {
  baseStats: {
    physPower: '+25%',
    speed: '-20%',
    hpMax: '+125%'
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