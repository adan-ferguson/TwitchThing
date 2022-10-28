import { bossMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'
import gainHealthAction from '../../actions/gainHealthAction.js'
import biteMonsterItem from '../../monsterItems/biteMonsterItem.js'

export default {
  baseStats: {
    physPower: '+10%',
    speed: '-30%',
    hpMax: '+50%'
  },
  items: [
    {
      name: 'Boss',
      mods: [bossMod]
    },
    {
      name: 'Enrage',
      description: 'Gain stats based on missing health.',
      scaledStats: {
        scaling: {
          property: 'hpPct',
          inverted: true
        },
        stats: {
          speed: '75%',
          physPower: '75%',
          physDef: '50%'
        }
      }
    },
    biteMonsterItem()
  ]
}