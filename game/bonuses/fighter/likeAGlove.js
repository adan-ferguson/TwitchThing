import { exponentialValue } from '../../exponentialValue.js'
import { roundToFixed } from '../../utilFunctions.js'
import { signatureWeaponBonus } from '../combined.js'

const SCALING = 0.25
const BASE = 40

export default {
  displayName: 'Live A Glove',
  effect: level => ({
    stats: {
      mainHandDamage: roundToFixed(exponentialValue(SCALING, level - 1, BASE), 2) + '%'
    }
  }),
  requires: signatureWeaponBonus.name,
  minOrbs: 10
}