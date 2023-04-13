import cancelAction from '../actions/actionDefs/common/cancelAction.js'

export default {
  name: 'Fluttering',
  abilities: {
    attacked: {
      cooldown: 10000,
      description: 'Automatically dodge an attack.',
      actions: [
        cancelAction({
          cancelReason: 'dodged'
        })
      ]
    }
  }
}