import { exponentialValueCumulative } from '../../exponentialValue.js'
import { all as Effects } from '../../statusEffects/combined.js'

const SCALING = 0.2
const BASE = 4

export default {
  effect: level => {
    const val = Math.ceil(exponentialValueCumulative(SCALING, level, BASE))
    return {
      abilities: {
        attackHit: {
          description: `After landing an attack, gain [SphysPower${val}] until end of combat. (Stacks)`,
          actions: [{
            type: 'statusEffect',
            affects: 'self',
            effect: {
              name: Effects.frenzied.name,
              params: {
                perStack: val
              }
            }
          }]
        }
      }
    }
  },
  rarity: 1,
  minOrbs: 10,
  upgradable: true
}