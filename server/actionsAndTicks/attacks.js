import { takeDamage, triggerEvent } from './common.js'
import { makeActionResult } from '../../game/actionResult.js'
import attackAction from '../../game/actions/attackAction.js'

export function performAttackAction(combat, attacker, actionDef = {}){

  actionDef = attackAction({
    damageMulti: 1,
    damageType: 'auto',
    damageScaling: 'auto',
    ...actionDef
  })

  const enemy = combat.getEnemyOf(attacker)
  const resultObj = {
    type: 'attack',
    triggeredEvents: [],
    subject: enemy.uniqueID
  }

  if(actionDef.damageType === 'auto'){
    actionDef.damageType = attacker.basicAttackType
  }

  if(actionDef.damageScaling === 'auto'){
    actionDef.damageScaling = actionDef.damageType
  }

  resultObj.triggeredEvents.push(...triggerEvent(combat, enemy, 'targeted'))
  resultObj.triggeredEvents.push(...triggerEvent(combat, enemy, 'attacked'))

  if(actionDef.damageType === 'phys'){
    resultObj.triggeredEvents.push(...triggerEvent(combat, enemy, 'physAttacked'))
  }else if(actionDef.damageType === 'magic'){
    resultObj.triggeredEvents.push(...triggerEvent(combat, enemy, 'magicAttacked'))
  }

  if(resultObj.triggeredEvents.at(-1)?.cancelled){
    return makeActionResult({
      ...resultObj,
      cancelled: true
    })
  }
  if(dodgeAttack(enemy)){
    return makeActionResult({
      ...resultObj,
      cancelled: 'dodged'
    })
  }
  if(missAttack(attacker)){
    return makeActionResult({
      ...resultObj,
      cancelled: 'missed'
    })
  }

  let damage = attacker[actionDef.damageScaling + 'Power']
  damage *= actionDef.damageMulti
  damage += actionDef.targetHpPct * enemy.hp

  const damageInfo = {
    damageType: actionDef.damageType,
    damage: damage * attacker.stats.get('damageDealt').value
  }

  if(attemptCrit(attacker, enemy)){
    damageInfo.damage *= (1 + attacker.stats.get('critDamage').value)
    damageInfo.crit = true
  }

  const damageResult = dealDamage(combat, attacker, enemy, damageInfo)

  resultObj.data = damageResult.data
  resultObj.triggeredEvents.push(...damageResult.triggeredEvents)
  resultObj.triggeredEvents.push(...triggerEvent(combat, attacker, 'attackHit'))
  resultObj.triggeredEvents.push(...triggerEvent(combat, enemy, 'hitByAttack'))

  if(damageInfo.crit){
    resultObj.triggeredEvents.push(...triggerEvent(combat, attacker, 'crit'))
  }

  return makeActionResult(resultObj)
}

function attemptCrit(actor, target){
  return Math.random() + target.stats.get('enemyCritChance').value + actor.stats.get('critChance').value > 1
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