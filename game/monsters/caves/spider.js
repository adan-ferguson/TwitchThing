import statusEffect from '../../actions/statusEffectAction.js'

export default {
  baseStats: {
    hpMax: '+10%'
  },
  items: [
    {
      name: 'Web Shot',
      abilities: {
        active: {
          cooldown: 8000,
          actions: [
            statusEffect({
              affects: 'enemy',
              effect: {
                stacking: true,
                displayName: 'Webbed',
                stats: {
                  slow: 1500
                }
              }
            })
          ]
        }
      }
    }
  ]
}