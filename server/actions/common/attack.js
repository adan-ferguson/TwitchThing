export default function(combat, attacker, effect = null, actionDef = {}){

  const enemy = combat.getEnemyOf(attacker)
  // const resultObj = {
  //   type: 'attack',
  //   triggeredEvents: [],
  //   subject: enemy.uniqueID
  // }

  if(actionDef.damageType === 'auto'){
    actionDef.damageType = attacker.basicAttackType
  }

  if(actionDef.damageScaling === 'auto'){
    actionDef.damageScaling = actionDef.damageType
  }

  // TODO: replacements

  const eventsToTrigger = ['targeted', 'attacked', actionDef.damageType + 'Attacked']
  for(let eventName of eventsToTrigger){
    combat.triggerEvent(combat, enemy, eventName)
  }

  if(dodgeAttack(enemy)){
    combat.triggerEvent(combat, enemy, 'dodge')
    return {
      cancelled: 'dodge'
    }
  }

  if(missAttack(attacker)){
    combat.triggerEvent(combat, attacker, 'miss')
    return {
      cancelled: 'miss'
    }
  }

  let damage = attacker[actionDef.damageScaling + 'Power']
  // damage *= actionDef.damageMulti
  // damage += actionDef.targetHpPct * enemy.hp
  // damage += actionDef.targetMaxHpPct * enemy.hpMax
  // damage *= attacker.statsForEffect(effect).get(attackDamageStat).value
  // attacker.effectInstances.forEach(effect => {
  //   // TODO: too hardcoded
  //   if(effect.effectData.damageDealtModifier){
  //     damage *= effect.effectData.damageDealtModifier(enemy)
  //   }
  // })

  const damageInfo = {
    damageType: actionDef.damageType,
    damage: damage * attacker.stats.get('damageDealt').value,
    range: actionDef.range
  }

  // if(attemptCrit(actor, enemy, actionDef.extraCritChance)){
  //   damageInfo.damage *= (1 + attacker.stats.get('critDamage').value + actionDef.extraCritDamage)
  //   damageInfo.crit = true
  // }

  const damageResult = dealDamage(combat, attacker, enemy, damageInfo)

  resultObj.data = damageResult.data
  resultObj.triggeredEvents.push(...damageResult.triggeredEvents)
  resultObj.triggeredEvents.push(...triggerEvent(combat, attacker, 'attackHit'))
  resultObj.triggeredEvents.push(...triggerEvent(combat, attacker, damageInfo.damageType + 'AttackHit'))
  resultObj.triggeredEvents.push(...triggerEvent(combat, enemy, 'hitByAttack'))

  if(damageInfo.crit){
    resultObj.data.crit = true
    resultObj.triggeredEvents.push(...triggerEvent(combat, attacker, 'crit', {
      damageResultData: damageResult.data
    }))
  }

  return makeActionResult(resultObj)
}

function attemptCrit(actor, target, bonusCritChance){
  return Math.random() +
    target.stats.get('enemyCritChance').value +
    actor.stats.get('critChance').value +
    bonusCritChance > 1
}

function dodgeAttack(actor){
  return Math.random() + actor.stats.get('dodgeChance').value > 1
}

function blockAttack(actor){
  return Math.random() + actor.stats.get('blockChance').value > 1
}

function missAttack(actor){
  return Math.random() + actor.stats.get('missChance').value > 1
}
