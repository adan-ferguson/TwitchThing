import bossMonsterItem from '../../monsterItems/bossMonsterItem.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'

const EXTRA_HEAD = statusEffectAction({
  base: barrierStatusEffect,
  effect: {
    displayName: 'Extra Head',
    description: 'Grants an extra attack',
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
    hpMax: '-72%',
    physPower: '-65%',
    speed: -100
  },
  items: [
    bossMonsterItem,
    {
      name: 'Multi-Headed',
      abilities: {
        startOfCombat: {
          uses: 1,
          description: 'Start combat with six Extra Heads.',
          actions: new Array(6).fill(EXTRA_HEAD)
        }
      }
    },
    {
      name: 'Regenerate Head',
      abilities: {
        tick: {
          initialCooldown: 10000,
          description: 'Sprout a new Extra Head.',
          actions: [EXTRA_HEAD]
        }
      }
    }
  ]
}