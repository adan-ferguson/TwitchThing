import { bossMod } from '../../mods/combined.js'
import biteMonsterItem from '../../monsterItems/biteMonsterItem.js'

export default {
  baseStats: {
    physPower: '+20%',
    speed: -50,
    hpMax: '+120%'
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
          speed: 60,
          physPower: '50%',
          physDef: '50%'
        }
      }
    },
    biteMonsterItem()
  ]
}