import { scaledValueCumulative } from '../../scaledValue.js'
import { all as Effects } from '../../statusEffects/combined.js'

const SCALING = 0.2
const BASE = 4

export default {
  effect: level => ({
    abilities: {
      attackHit: {
        actions: [{
          type: 'statusEffect',
          affects: 'self',
          effect: {
            name: Effects.frenzied.name,
            params: {
              perStack: Math.ceil(scaledValueCumulative(SCALING, level, BASE))
            }
          }
        }]
      }
    }
  }),
  rarity: 1,
  minOrbs: 10,
  upgradable: true
}