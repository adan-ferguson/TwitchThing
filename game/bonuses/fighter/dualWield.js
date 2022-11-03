import { dualWieldMod } from '../../mods/combined.js'

export default {
  effect: {
    mods: [dualWieldMod],
    description: 'Slot #2 becomes another Signature Weapon slot and gains the same benefits.'
  },
  rarity: 2,
  requires: 'signatureWeapon',
  minOrbs: 20
}