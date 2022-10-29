import { useEffectAbility } from './performAction.js'
import { makeActionResult } from '../../game/actionResult.js'
import scaledNumber from '../../game/scaledNumber.js'

export function performGainHealthAction(combat, actor, gainHealthDef){
  const gain = Math.ceil(scaledNumber(actor, gainHealthDef))
  if(gain <= 0){
    return
  }
  const hpBefore = actor.hp
  actor.hp += gain
  return {
    subject: actor.uniqueID,
    type: 'gainHealth',
    data: {
      amount: actor.hp - hpBefore
    }
  }
}

export function takeDamage(combat, subject, damageInfo){

  damageInfo = {
    damage: 0,
    damageType: 'phys',
    damagePct: 0, // pct CURRENT health damage
    ignoreDefense: false,
    ...damageInfo
  }

  const result = {
    baseDamage: subject.stats.get('damageTaken').value * (damageInfo.damage + subject.hp * damageInfo.damagePct),
    blocked: 0,
    damageType: damageInfo.damageType
  }
  const triggeredEvents = []
  let damage = result.baseDamage

  if(!damageInfo.ignoreDefense){
    const blocked = Math.floor(result.baseDamage * subject.stats.get(damageInfo.damageType + 'Def').value)
    damage = result.baseDamage - blocked
    result.blocked = blocked
  }

  damage = Math.ceil(damage)

  result.damageDistribution = subject.statusEffectsData.ownerTakingDamage(damage)
  subject.hp -= result.damageDistribution.hp
  result.totalDamage = Object.values(result.damageDistribution).reduce((prev, val) => prev + val)

  if(damage > 0){
    triggeredEvents.push(...triggerEvent(combat, subject, 'takeDamage'))
  }

  return makeActionResult({
    data: result,
    type: 'damage',
    subject: subject.uniqueID,
    triggeredEvents
  })
}

export function triggerEvent(combat, owner, eventName){
  const effects = owner.triggeredEffects(eventName)
  const results = []
  for(let effect of effects){
    results.push(useEffectAbility(combat, effect, eventName))
    if(results.at(-1)?.cancelled){
      return results
    }
  }
  return results
}

export function performRemoveStackAction(combat, owner, effect){
  effect.removeStack()
  return makeActionResult({
    type: 'removeStack',
    subject: owner.uniqueID
  })
}

export function performCancelAction(owner, def){
  return makeActionResult({
    data: {
      cancelReason: def.cancelReason,
    },
    subject: owner.uniqueID,
    type: 'cancel',
    cancelled: true
  })
}