import { useEffectAbility } from './performAction.js'
import { makeActionResult } from '../../game/actionResult.js'

export function performGainHealthAction(combat, actor, gainHealthDef){
  let gain = 0
  if(gainHealthDef.pct){
    gain += actor.hpMax * gainHealthDef.pct
  }
  gain = Math.ceil(gain)
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
    useDecimals: false,
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

  if(!damageInfo.useDecimals){
    damage = Math.ceil(damage)
  }

  result.damageDistribution = subject.statusEffectsData.ownerTakingDamage(damage)
  subject.hp -= result.damageDistribution.hp

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
  effects.forEach(effect => {
    results.push(useEffectAbility(combat, effect, eventName))
  })
  return results
}