import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  baseStats: {
    hpMax: '+30%',
    speed: -15
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