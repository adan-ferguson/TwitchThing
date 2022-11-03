import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  baseStats: {
    hpMax: '-10%',
    physPower: '-38%'
  },
  items: [
    {
      name: 'Frenzy',
      abilities: {
        attackHit: {
          description: 'Gain phys power and speed after landing an attack.',
          actions: [
            statusEffectAction({
              effect: {
                stacking: true,
                displayName: 'Frenzied',
                description: 'Increased phys power and attack speed.',
                stats: {
                  physPower: '+10%',
                  speed: 20
                }
              }
            })
          ]
        }
      }
    }
  ]
}