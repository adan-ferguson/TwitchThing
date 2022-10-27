import cancelAction from '../../actions/cancelAction.js'
import removeThisStatusEffectAction from '../../actions/removeThisStatusEffectAction.js'

export default {
  abilities: {
    beforeActive: {
      actions: [
        removeThisStatusEffectAction(),
        cancelAction({
          cancelReason: 'Stand Up'
        })
      ]
    }
  }
}