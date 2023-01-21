const BASE = 20

export default {
  effect: level => {
    const val = BASE * level
    return {
      slotEffect: {
        slotTag: 'signatureWeapon',
        stats: {
          attackDamage: val + '%'
        }
      },
      description: `Your Signature Weapon deals ${val}% more damage.`,
      displayName: 'Signature Slice'
    }
  },
  requires: 'signatureWeapon',
  minOrbs: 10
}