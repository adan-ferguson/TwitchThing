const BASE = 20

export default {
  effect: level => ({
    stats: {
      mainHandDamage: BASE * level + '%'
    }
  }),
  requires: 'signatureWeapon',
  minOrbs: 10
}