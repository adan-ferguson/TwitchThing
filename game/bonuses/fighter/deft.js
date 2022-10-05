const SCALING = 0.2
const BASE = 1

export default {
  effect: level => ({
    stats: {
      speed: BASE + SCALING * level
    }
  }),
  upgradable: true,
  rarity: 0
}