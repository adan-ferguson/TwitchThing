import { bossMod } from '../../mods/combined.js'

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
      name: 'Enrage',
      conditions: {
        combatTimeAbove: 30000
      },
      stats: {
        physPower: '+100%'
      }
    }
  ]
}