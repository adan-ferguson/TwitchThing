import { bossMod } from '../../mods/combined.js'
import biteMonsterItem from '../../monsterItems/biteMonsterItem.js'

export default {
  baseStats: {
    physPower: '+10%',
    speed: -50,
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
          speed: 100,
          physPower: '75%',
          physDef: '50%'
        }
      }
    },
    biteMonsterItem()
  ]
}