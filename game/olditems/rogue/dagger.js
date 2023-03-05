import physScaling from '../../mods/generic/physScaling.js'

export default {
  levelFn: level => ({
    stats: {
      critChance: 0.12 + 0.03 * level
    },
    mods: [physScaling]
  }),
  orbs: 2
}