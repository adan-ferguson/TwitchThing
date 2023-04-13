import gainHealthAction from '../../../game/actions/actionDefs/common/gainHealthAction.js'
import scaledNumber from '../../../game/scaledNumber.js'

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