import { physPowerStat } from '../../stats/combined.js'

export default {
  levelFn: level => {
    const pct = `+${18 + level * 2}%`
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
              isBuff: true,
              stats: {
                [physPowerStat.name]: pct
              }
            }
          }]
        }
      }
    }
  },
  displayName: 'Berserker\'s Gauntlet',
  orbs: 5,
  rarity: 1
}