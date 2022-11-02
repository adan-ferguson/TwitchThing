import { dualWieldMod } from '../../mods/combined.js'
import { signatureWeaponBonus } from '../combined.js'

export default {
  effect: {
    mods: [dualWieldMod],
    description: 'Slot #2 becomes another Signature Weapon slot and gains the same benefits.'
  },
  rarity: 2,
  requires: signatureWeaponBonus.name,
  minOrbs: 20
}