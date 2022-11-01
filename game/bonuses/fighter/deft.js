const BASE = 10

export default {
  effect: level => ({
    stats: {
      speed: BASE * level
    }
  }),
  upgradable: true,
  rarity: 0
}