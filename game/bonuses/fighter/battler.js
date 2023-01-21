const BASE = 25

export default {
  effect: level => ({
    stats: {
      combatXP: BASE * level + '%'
    }
  }),
  minOrbs: 10
}