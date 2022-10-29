import bossMonsterItem from '../../monsterItems/bossMonsterItem.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'

const EXTRA_HEAD = statusEffectAction({
  base: barrierStatusEffect,
  effect: {
    displayName: 'Extra Head',
    params: {
      hpMax: 1
    },
    stats: {
      physPower: '+100%'
    }
  }
})

export default {
  baseStats: {
    magicDef: '+30%',
    hpMax: '-50%',
    speed: '-20%'
  },
  items: [
    bossMonsterItem,
    {
      name: 'Multi-Headed',
      actions: {
        startOfCombat: {
          description: 'Start combat with five Extra Heads.',
          actions: new Array(5).fill(EXTRA_HEAD)
        }
      }
    },
    {
      name: 'Regrow Head',
      actions: {
        active: {

        },

      }
    }
  ]
}