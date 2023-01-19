import { bossMod } from '../../mods/combined.js'
import biteMonsterItem from '../../monsterItems/biteMonsterItem.js'

export default {
  baseStats: {
    physPower: '+10%',
    speed: -60,
    hpMax: '+80%'
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
          physPower: '50%',
          physDef: '50%'
        }
      }
    },
    biteMonsterItem()
  ]
}