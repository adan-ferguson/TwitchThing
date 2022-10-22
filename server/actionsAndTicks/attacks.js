import { takeDamage, triggerEvent } from './common.js'
import { makeActionResult } from '../../game/actionResult.js'

export function performAttackAction(combat, attacker, actionDef = {}){

  actionDef = {
    damageMulti: 1,
    damageType: 'auto',
    ...actionDef
  }

  const enemy = combat.getEnemyOf(attacker)
  const resultObj = {
    type: 'attack',
    triggeredEvents: [],
    subject: enemy.uniqueID
  }

  if(actionDef.damageType === 'auto'){
    actionDef.damageType = attacker.basicAttackType
  }

  resultObj.triggeredEvents.push(...triggerEvent(combat, enemy, 'targeted'))
  if(resultObj.triggeredEvents.at(-1)?.cancelled){
    return makeActionResult({
      ...resultObj,
      cancelled: true
    })
  }
  if(dodgeAttack(enemy)){
    return makeActionResult({
      ...resultObj,
      cancelled: true,
      data: {
        dodged: true
      }
    })
  }
  if(missAttack(attacker)){
    return makeActionResult({
      ...resultObj,
      cancelled: true,
      data: {
        missed: true
      }
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

  const damageResult = dealDamage(combat, attacker, enemy, damageInfo)

  resultObj.data = damageResult.data
  resultObj.triggeredEvents.push(...damageResult.triggeredEvents)
  resultObj.triggeredEvents.push(...triggerEvent(combat, attacker, 'attackHit'))
  resultObj.triggeredEvents.push(...triggerEvent(combat, enemy, 'hitByAttack'))

  return makeActionResult(resultObj)
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