import bossMonsterItem from '../../monsterItems/bossMonsterItem.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'

const EXTRA_HEAD = statusEffectAction({
  base: barrierStatusEffect,
  effect: {
    displayName: 'Extra Head',
    stacking: false,
    params: {
      hpMax: 1
    },
    stats: {
      attacks: 1
    }
  }
})

export default {
  baseStats: {
    magicDef: '+30%',
    hpMax: '-50%',
    speed: -100,
    physPower: '-50%'
  },
  items: [
    bossMonsterItem,
    {
      name: 'Multi-Headed',
      abilities: {
        startOfCombat: {
          description: 'Start combat with five Extra Heads.',
          actions: new Array(5).fill(EXTRA_HEAD)
        }
      }
    },
    // {
    //   name: 'Regrow Head',
    //   actions: {
    //     active: {
    //
    //     },
    //
    //   }
    // }
  ]
}