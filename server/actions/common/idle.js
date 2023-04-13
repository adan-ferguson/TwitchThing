import { makeActionResult } from '../../../game/actionResult.js'

export function performCancelAction(owner, def = {}){
  return makeActionResult({
    data: {
      cancelReason: def.cancelReason,
    },
    subject: owner.uniqueID,
    type: 'cancel',
    cancelled: true
  })
}