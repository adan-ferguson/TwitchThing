import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => {
    const duration = 8000 + level * 2000
    return {
      abilities: {
        startOfCombat: {
          description: `Prevent all damage taken for the first ${Math.round(duration/1000)}s of combat.`,
          actions: [
            statusEffectAction({
              effect: {
                isBuff: true,
                duration,
                displayName: 'Angelic Guard',
                stacking: 'extend',
                stackingId: 'angelicguard',
                stats: {
                  damageTaken: '-100%'
                }
              }
            })
          ]
        }
      }
    }
  },
  orbs: 12,
  rarity: 2
}