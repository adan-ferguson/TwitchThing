import { makeActionResult } from '../../game/actionResult.js'
import scaledNumber from '../../game/scaledNumber.js'
import gainHealthAction from '../../game/actions/gainHealthAction.js'

export function performGainHealthAction(combat, actor, gainHealthDef){
  gainHealthDef = gainHealthAction(gainHealthDef)
  const subject = gainHealthDef.affects === 'self' ? actor : combat.getEnemyOf(actor)
  const gain = Math.ceil(scaledNumber(subject, gainHealthDef.scaling))
  if(gain <= 0){
    return
  }
  const hpBefore = subject.hp
  subject.hp += gain
  return {
    subject: subject.uniqueID,
    type: 'gainHealth',
    data: {
      amount: subject.hp - hpBefore
    }
  }
}

export function triggerEvent(combat, owner, eventName, triggerData = {}){
  combat.triggerEvent(owner, eventName, triggerData)
}

export function performRemoveStackAction(combat, owner, effect){
  effect.removeStack()
  return makeActionResult({
    type: 'removeStack',
    subject: owner.uniqueID
  })
}

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

export function performParentEffectAction(combat, effect, actionDef){
  const data = {}
  if(actionDef.refreshCooldown){
    effect.refreshCooldown()
    data.refreshed = true
  }
  return makeActionResult({
    type: 'parentEffect',
    data,
    subject: effect.owner.uniqueID
  })
}

export function performRefreshCooldownsAction(combat, owner, effect, actionDef){
  owner.itemInstances.forEach(ii => {
    if(actionDef.excludeSelf && ii === effect){
      return
    }
    ii?.refreshCooldown(actionDef)
  })
}