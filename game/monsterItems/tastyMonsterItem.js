import gainHealthAction from '../actions/gainHealthAction.js'

export default {
  name: 'Tasty',
  description: 'Whoever defeats this regains 20% health.',
  abilities: {
    defeated: {
      phantom: true,
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