import { dealDamage } from '../../combat/dealDamage.js'

export default function(combat, attacker, effect = null, actionDef = {}){

  const enemy = combat.getEnemyOf(attacker)

  if(actionDef.damageType === 'auto'){
    actionDef.damageType = attacker.basicAttackType
  }

  if(actionDef.damageScaling === 'auto'){
    actionDef.damageScaling = actionDef.damageType
  }

  // TODO: replacements

  const eventsToTrigger = ['targeted', 'attacked', actionDef.damageType + 'Attacked']
  for(let eventName of eventsToTrigger){
    combat.triggerEvent(enemy, eventName)
  }

  if(dodgeAttack(enemy)){
    combat.triggerEvent(enemy, 'dodge')
    return {
      cancelled: 'dodge'
    }
  }

  if(missAttack(attacker)){
    combat.triggerEvent(attacker, 'miss')
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

  let damageInfo = {
    damageType: actionDef.damageType,
    damage: damage * attacker.stats.get('damageDealt').value,
    range: actionDef.range
  }

  if(attemptCrit(attacker, enemy, actionDef.extraCritChance)){
    damageInfo.damage *= (1 + attacker.stats.get('critDamage').value + actionDef.extraCritDamage)
    damageInfo.crit = true
  }

  damageInfo = dealDamage(combat, attacker, enemy, damageInfo)

  combat.triggerEvent(attacker, 'attackHit', damageInfo)
  combat.triggerEvent(attacker, damageInfo.damageType + 'AttackHit', damageInfo)
  combat.triggerEvent(enemy, 'hitByAttack', damageInfo)

  if(damageInfo.crit){
    combat.triggerEvent(attacker, 'crit', damageInfo)
  }

  return { damageInfo }
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

function missAttack(actor){
  return Math.random() + actor.stats.get('missChance').value > 1
}
