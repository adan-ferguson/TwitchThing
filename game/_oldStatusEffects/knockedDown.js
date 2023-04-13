import cancelAction from '../../actions/actionDefs/common/cancelAction.js'
import removeThisStatusEffectAction from '../../actions/actionDefs/common/removeThisStatusEffectAction.js'

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