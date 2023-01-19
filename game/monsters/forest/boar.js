import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  baseStats: {
    hpMax: '+40%',
    physPower: '+10%',
    speed: -10
  },
  items: [
    {
      name: 'Tasty',
      description: 'Whoever defeats this regains 20% health.',
      abilities: {
        defeated: {
          actions: [
            gainHealthAction({
              scaling: {
                hpMax: 0.2
              },
              affects: 'enemy'
            })
          ]
        }
      }
    }
  ]
}