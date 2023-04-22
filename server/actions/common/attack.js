import { processAbilityEvents } from '../../mechanics/abilities.js'
import { dealDamage } from '../../mechanics/dealDamage.js'

export default function(combat, attacker, effect = null, actionDef = {}){

  const enemy = combat.getEnemyOf(attacker)
  const ret = { subject: enemy.uniqueID }

  if(actionDef.damageType === 'auto'){
    actionDef.damageType = attacker.basicAttackType
  }

  if(actionDef.damageScaling === 'auto'){
    actionDef.damageScaling = actionDef.damageType
  }

  actionDef = processAbilityEvents(combat, ['attacked', actionDef.damageType + 'Attacked'], enemy, actionDef)

  if(actionDef.forceDodge || dodgeAttack(enemy)){
    return {
      cancelled: 'dodge'
    }
  }

  if(missAttack(attacker)){
    processAbilityEvents('miss', attacker)
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
  damageInfo = processAbilityEvents(combat, ['attackHit', damageInfo.damageType + 'AttackHit'], attacker, damageInfo)
  damageInfo = processAbilityEvents(combat, 'hitByAttack', enemy, damageInfo)

  if(damageInfo.crit){
    damageInfo = processAbilityEvents(combat, 'crit', attacker, damageInfo)
  }

  ret.damageInfo = damageInfo

  return ret
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
