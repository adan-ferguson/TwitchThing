import { takeDamage, triggerEvent } from './common.js'
import { makeActionResult } from '../../game/actionResult.js'

export function performAttack(combat, attacker, actionDef = {}){

  actionDef = {
    damageMulti: 1,
    damageType: 'auto',
    ...actionDef
  }

  const triggeredEvents = []
  const enemy = combat.getEnemyOf(attacker)

  if(actionDef.damageType === 'auto'){
    actionDef.damageType = attacker.basicAttackType
  }

  triggeredEvents.push(...triggerEvent(combat, enemy, 'beforeAttacked'))

  if(dodgeAttack(enemy)){
    return makeActionResult({
      subject: enemy.uniqueID,
      type: 'dodge',
      data: { failed: true },
      triggeredEvents
    })
  }

  if(missAttack(attacker)){
    return makeActionResult({
      subject: enemy.uniqueID,
      type: 'miss',
      data: { failed: true },
      triggeredEvents
    })
  }

  let damage = attacker[actionDef.damageType + 'Power']
  damage *= actionDef.damageMulti

  const damageInfo = {
    damageType: actionDef.damageType,
    damage: damage * attacker.stats.get('damageDealt').value
  }

  if(attemptCrit(attacker)){
    damageInfo.damage *= (1 + attacker.stats.get('critDamage').value)
    damageInfo.crit = true
  }

  const result = dealDamage(combat, attacker, enemy, damageInfo)

  result.triggeredEvents = [...triggeredEvents, ...result.triggeredEvents]
  result.triggeredEvents.push(...triggerEvent(combat, attacker, 'attackHit'))
  result.triggeredEvents.push(...triggerEvent(combat, enemy, 'hitByAttack'))

  return result
}

function attemptCrit(actor){
  return Math.random() + actor.stats.get('critChance').value > 1
}

function dodgeAttack(actor){
  return Math.random() + actor.stats.get('dodgeChance').value > 1
}

function missAttack(actor){
  return Math.random() + actor.stats.get('missChance').value > 1
}

function dealDamage(combat, actor, enemy, damageInfo){

  const damageResult = takeDamage(combat, enemy, damageInfo)

  const lifesteal = Math.min(
    actor.hpMax - actor.hp,
    Math.ceil(actor.stats.get('lifesteal').value * damageResult.data.damageDistribution.hp)
  )

  // if(lifesteal){
  //   damageResult.triggeredEvents.push(performGainHealthAction(actor, lifesteal))
  // }

  return damageResult
}