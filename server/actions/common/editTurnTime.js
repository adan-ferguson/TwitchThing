import { makeActionResult } from '../../../game/actionResult.js'

export function performTurnTimeAction(combat, owner, actionDef){
  const timeBefore = owner.timeUntilNextAction
  if(actionDef.setRemaining){
    owner.timeUntilNextAction = actionDef.setRemaining
  }else if(actionDef.change){
    owner.timeSinceLastAction += actionDef.change
  }
  const timeAfter = owner.timeUntilNextAction
  return makeActionResult({
    type: 'turnTime',
    data: {
      timeBefore,
      timeAfter
    },
    subject: owner.uniqueID
  })
}