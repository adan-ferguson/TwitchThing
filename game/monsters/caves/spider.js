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
          cooldown: 9000,
          description: 'Apply a 1 second/turn slow. Lasts 15s.',
          actions: [
            statusEffect({
              affects: 'enemy',
              effect: {
                stacking: true,
                displayName: 'Webbed',
                description: 'Action timer is slowed.',
                duration: 15000,
                persisting: true,
                stats: {
                  slow: 1000
                }
              }
            })
          ]
        }
      }
    }
  ]
}