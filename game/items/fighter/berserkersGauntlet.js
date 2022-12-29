import { physPowerStat, speedStat } from '../../stats/combined.js'

export default {
  levelFn: level => {
    const pct = `+${8 + level * 2}%`
    return {
      abilities: {
        attackHit: {
          description: `After attacking, gain [SphysPower${pct}] until end of combat. (Stacks)`,
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
  displayName: 'Berserker\'s Gauntlet',
  orbs: 5
}