import gainHealthAction from '../actions/actionDefs/common/gainHealthAction.js'

export default {
  name: 'Tasty',
  abilities: {
    defeated: {
      description: 'Whoever defeats this regains 20% health.',
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