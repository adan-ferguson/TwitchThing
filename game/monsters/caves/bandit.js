import { sneakAttackMod } from '../../mods/combined.js'

export default {
  baseStats: {
    speed: 5,
    hpMax: '-20%',
    physPower: '+5%'
  },
  items: [
    {
      name: 'Ambush',
      mods: [sneakAttackMod]
    }
  ]
}