import { useEffectAbility } from './performAction.js'
import { makeActionResult } from '../../game/actionResult.js'

export function gainHealth(actor, amount){
  if(amount <= 0){
    return
  }
  const hpBefore = actor.hp
  actor.changeHpWithDecimals(amount)
  const finalAmount = actor.hp - hpBefore
  if(finalAmount > 0){
    return {
      subject: actor.uniqueID,
      type: 'gainHealth',
      amount: actor.hp - hpBefore
    }
  }
}

export function regen(fighterInstance){
  return gainHealth(fighterInstance, fighterInstance.baseHp * fighterInstance.stats.get('regen').value)
}

export function takeDamage(combat, subject, damageInfo){

  damageInfo = {
    damage: 0,
    damageType: 'phys',
    damagePct: 0, // pct CURRENT health damage
    ignoreDefense: false,
    useDecimals: false,
    ...damageInfo
  }

  const result = {
    baseDamage: damageInfo.damage + subject.hp * damageInfo.damagePct,
    blocked: 0,
    damageType: damageInfo.damageType
  }
  const triggeredEvents = []
  result.finalDamage = result.baseDamage

  if(!damageInfo.ignoreDefense){
    const blocked = Math.floor(result.baseDamage * subject.stats.get(damageInfo.damageType + 'Def').value)
    result.finalDamage = Math.min(subject.hp, result.baseDamage - blocked)
  }

  if(!damageInfo.useDecimals){
    result.finalDamage = Math.ceil(result.finalDamage)
  }

  subject.changeHpWithDecimals(-result.finalDamage)

  if(result.finalDamage > 0){
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
  effects.forEach(effect => {
    results.push(useEffectAbility(combat, effect, eventName))
  })
  return results
}