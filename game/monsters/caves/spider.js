import statusEffect from '../../actions/statusEffectAction.js'

export default {
  baseStats: {
    physPower: '-10%',
    speed: -10
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
                description: 'Action timer is slowed.',
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