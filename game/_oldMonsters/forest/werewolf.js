import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'

export default {
  baseStats: {
    hpMax: '+20%',
    physPower: '-40%'
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
                  speed: 25
                }
              }
            })
          ]
        }
      }
    }
  ]
}