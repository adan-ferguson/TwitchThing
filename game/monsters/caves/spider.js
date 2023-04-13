import statusEffect from '../../actions/actionDefs/common/statusEffectAction.js'

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
          description: 'Reduce target\'s speed by 25. Lasts 10s.',
          actions: [
            statusEffect({
              affects: 'enemy',
              effect: {
                stacking: true,
                displayName: 'Webbed',
                description: 'Speed reduced.',
                duration: 10000,
                persisting: true,
                stats: {
                  speed: -25
                }
              }
            })
          ]
        }
      }
    }
  ]
}