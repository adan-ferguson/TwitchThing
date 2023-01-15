import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => {
    const amount = Math.round(12 + level * 3)
    return {
      abilities: {
        attacked: {
          description: `After attacked, gain [SphysPower${amount}%] and [SmagicPower${amount}%] for rest of combat.`,
          actions: [
            statusEffectAction({
              effect: {
                isBuff: true,
                displayName: 'Courage',
                stacking: true,
                stats: {
                  magicPower: amount + '%',
                  physPower: amount + '%'
                }
              }
            })
          ]
        }
      }
    }
  },
  orbs: 7
}