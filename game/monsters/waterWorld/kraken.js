import { bossMod } from '../../mods/combined.js'
import constrictMonsterItem from '../../monsterItems/constrictMonsterItem.js'

export default {
  baseStats: {
    physPower: '+50%',
    speed: -80,
    hpMax: '+200%'
  },
  items: [
    {
      name: 'Boss',
      mods: [bossMod]
    },
    constrictMonsterItem({
      initialCooldown: 15000
    })
  ]
}