import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => {
    const critDamage = 20 + level * 20
    return {
      abilities: {
        crit: {
          description: `After dodging, gain [ScritChance1] and [ScritDamage${critDamage}] next turn.`,
          actions: [
            statusEffectAction({
              isBuff: true,
              displayName: 'Phantom Attack',
              turns: 1,
              stats: {
                critChance: 1,
                critDamage: `+${critDamage}%`
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