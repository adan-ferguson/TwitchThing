import { gainHealth, takeDamage, triggerEvent } from './common.js'
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
  const dodged = attemptDodge(enemy)

  if(dodged){
    return makeActionResult({
      subject: enemy.uniqueID,
      type: 'dodge',
      data: { failed: true },
      triggeredEvents
    })
  }

  let damage = attacker[actionDef.damageType + 'Power']
  damage *= actionDef.damageMulti

  const damageInfo = {
    damageType: actionDef.damageType,
    damage
  }

  if(attemptCrit(attacker)){
    damage *= (1 + attacker.stats.get('critDamage').value)
    damageInfo.crit = true
  }

  const result = dealDamage(combat, attacker, enemy, damageInfo)
  result.triggeredEvents = [...triggeredEvents, ...result.triggeredEvents]
  result.triggeredEvents.push(...triggerEvent(combat, attacker, 'attackHit'))
  return result
}

function attemptCrit(actor){
  return Math.random() + actor.stats.get('critChance').value > 1
}

function attemptDodge(actor){
  return Math.random() + actor.stats.get('dodgeChance').value > 1
}

function dealDamage(combat, actor, enemy, damageInfo){

  const damageResult = takeDamage(combat, enemy, damageInfo)

  const lifesteal = Math.min(
    actor.hpMax - actor.hp,
    Math.ceil(actor.stats.get('lifesteal').value * damageResult.data.finalDamage)
  )

  if(lifesteal){
    damageResult.triggeredEvents.push(gainHealth(actor, lifesteal))
  }

  return damageResult
}