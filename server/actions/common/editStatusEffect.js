import { makeActionResult } from '../../../game/actionResult.js'

export function performRemoveStackAction(combat, owner, effect){
  effect.removeStack()
  return makeActionResult({
    type: 'removeStack',
    subject: owner.uniqueID
  })
}