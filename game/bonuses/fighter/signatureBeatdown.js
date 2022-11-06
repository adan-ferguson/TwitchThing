const BASE = 20

export default {
  effect: level => ({
    slotEffect: {
      slotTag: 'signatureWeapon',
      stats: {
        attackDamage: BASE * level + '%'
      }
    }
  }),
  requires: 'signatureWeapon',
  minOrbs: 10
}