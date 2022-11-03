import doubleStrikeMod from '../../mods/fighter/doubleStrikeMod.js'

export default {
  effect: {
    mods: [doubleStrikeMod],
    description: 'When you attack with a signature weapon, attack with both of them if possible.'
  },
  rarity: 2,
  requires: 'dualWield',
  minOrbs: 20
}