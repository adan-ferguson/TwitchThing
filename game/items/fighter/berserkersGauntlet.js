import { physPowerStat, speedStat } from '../../stats/combined.js'

export default {
  levelFn: level => {
    const pct = `+${9 + level * 3}%`
    return {
      abilities: {
        attackHit: {
          description: `After landing an attack, gain [SphysPower${pct}] until end of combat. (Stacks)`,
          actions: [{
            type: 'statusEffect',
            affects: 'self',
            effect: {
              displayName: 'Berserk',
              stacking: true,
              stats: {
                [physPowerStat.name]: pct
              }
            }
          }]
        }
      },
      stats: {
        [speedStat.name]: 15 + 5 * level
      }
    }
  },
  orbs: 5
}